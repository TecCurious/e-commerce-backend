import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserLoginValidation, UserRegisterValidation} from "../validation/zodValidation.js";
import { pool } from "../config/db.js";

// user register api
export const registerUser = async (req, res) => {
    try {
        // 1 data lena req.body se
        const { username, email, password } = req.body;

        //2 zod se validation krna
        const parseValue = UserRegisterValidation.parse({
            username,
            email,
            password,
        });
        console.log("parseValue kya a rhi h:", parseValue);

        // 3 database connection open krna
        const client = await pool.connect();

        try {
            // 4 check krna user already exist h ya nhi
            const user = await client.query("select * from users where email=$1 OR username=$2", [parseValue.email, parseValue.username]);

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
            await client.query("insert into users(username,email,password)values($1,$2,$3)", [parseValue.username, parseValue.email, hashedPassword]);
            // 7 success response bhejna
            return res.status(201).json({
                success: true,
                Message: "user created successfully!",
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


// export const loginUser=async(req,res)=>{
//     try {
//         // 1 client se username or password lena
//         const {username,password}=req.body;

//         // 2 agar username or password ki value empty h to error
//         if(!username||!password){
//             return res.status(400).json({
//                 success:false,
//                 message:"username or password is required",
//             });
//         }
//         // 3 database connection open krna
//         const client=await pool.connect();
//         try {
            
//         } catch (error) {
            
//         }
//     } catch (error) {
        
//     }
// }