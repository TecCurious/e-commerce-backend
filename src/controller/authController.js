import { pool } from "../config/db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { userCreationValidation, userLoginValidation } from "../../validation/zodValidation.js";


// register 
export const register = async (req, res) => {
    try {

        // zod validation
        const { username, email, password } = userCreationValidation.parse(req.body);


        // check user exist
        const userExist = await pool.query("select * from users where email=$1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({
                message: "user already exists"
            })
        }


        // hashed password and salt rounds=10
        const hashedPassword = await bcrypt.hash(password, 10);


        // inser new user
        const newUser = await pool.query(
            "insert into users (username,email,password)values($1,$2,$3) returning *", [username, email, hashedPassword]
        );


        // generate token for register
        const token = jwt.sign({
            id: newUser.rows[0].id
        }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(201).json({
            message: "user register successfully",
            user: newUser.rows[0],
            token,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "validation failed",
                errors: error.errors
            })
        }
        res.status(500).json({ error: error.message });
    }

}

// login
export const login = async (req, res) => {
    try {
        const { email, password } = userLoginValidation.parse(req.body);

        const user = await pool.query("select * from users where email=$1", [email]);
        if (user.rows.length === 0) {
            res.status(400).json({
                message: "invalid credentials"
            })
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({
                message: "invalid credentials"
            });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({
            message: "login successfully",
            user: { id: user.rows[0].id, username: user.rows[0].username },
            token,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "validation failed",
                errors: error.errors,
            });
        };
        res.status(500).json({
            message:"internal server error",
            error: error.message
        })
    }
}

