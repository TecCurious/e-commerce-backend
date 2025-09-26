import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserLoginValidation, UserRegisterValidation } from "../validation/zodValidation.js";
import { pool } from "../config/db.js";

// user register api
export const registerUser = async (req, res) => {
    try {
        // 1 data lena req.body se
        const { firstName, lastName, email, password } = req.body;

        //2 zod se validation krna
        const parseValue = UserRegisterValidation.parse({
            firstName,
            lastName,
            email,
            password,
        });
        console.log("parseValue kya a rhi h:", parseValue);

        // 3 database connection open krna
        const client = await pool.connect();

        try {
            // 4 check krna user already exist h ya nhi
            const user = await client.query("select * from users where email=$1 ", [parseValue.email]);

            if (user.rows.length > 0) {
                // agar user already h to error bhej do
                return res.status(409).json({
                    success: false,
                    Message: "user already exist! plz login",
                });
            }

            // 5 password hash krna
            const saltRounds = 10;//kitna strong hash chiye
            const hashedPassword = await bcrypt.hash(parseValue.password, saltRounds);

            // 6 user ko db me insert krna using hash password
            const createUser = await client.query("insert into users(firstName,lastName,email,password)values($1,$2,$3,$4)", [parseValue.firstName, parseValue.lastName, parseValue.email, hashedPassword]);

            console.log("created user:", createUser);
            const createUserResult = createUser.rows[0];


            // 7 success response bhejna
            return res.status(201).json({
                success: true,
                Message: "user created successfully!",
                user: {
                    id: createUserResult.id,
                    firstName: createUserResult.firstName,
                    lastName: createUserResult.lastName,
                    email: createUserResult.email,
                }
            });
        } catch (error) {
            console.error("db error:", error);
            return res.status(500).json({
                success: false,
                message: "db error",
            });
        } finally {
            client.release();
        }

    } catch (error) {
        console.error("error while creating user:", error);
        //  8 agar zod ka validation fail ho gya 
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "validation error",
                error: error.message,
            })
        }

        // 9 baki agar koi bhi error angya to uske lie
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    };
};


export const loginUser = async (req, res) => {
    try {
        console.log("req body",req.body)
        // 1 client se username or password lena
        const { email, password } = req.body;
            
        //  2 validation input
        const parseData=await UserLoginValidation.parse({
            email,password
        });

        // 3 database connection open krna
        const client = await pool.connect();
        
        try {
            //4 find user db by using email
            const user = await client.query("select * from users where email=$1", [email]);
            if (user.rows.length !== 1) {
                //5 agar user nhi mila 
                return res.status(404).json({
                    success: false,
                    message: "user not found! plz register first",
                });
            };
            const foundUser = user.rows[0];
            //6 compare enter password with hashed password
            const isMatchPassword = await bcrypt.compare(password, foundUser.hashedPassword);
            if (!isMatchPassword) {
                return res.status(401).json({
                    success: false,
                    message: "invalid credentials username or password incorrect",
                })
            }
            // 7 or agar details shi h to token generate kro
            const token = jwt.sign(
                {
                    id: foundUser.id,
                    firstName: foundUser.firstName,
                    lastName:foundUser.lastName,
                    email: foundUser.email,
                }, process.env.JWT_SECRET, { expiresIn: "1h" }
            );
            // 8 send login response with token 
            return res.status(200).json({
                success: true,
                message: "user login successfully!",
                token,
                user: {
                    id: foundUser.id,
                    firstName: foundUser.firstName,
                    lastName:foundUser.lastName,
                    email: foundUser.email,
                },
            });

        } catch (error) {
            console.error("db error:", error);
            return res.status(500).json({
                success: false,
                message: "db error",
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log("error while login:", error);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    };
};