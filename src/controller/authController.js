import { pool } from "../config/db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({
                message: "all fields are required"
            })
        }
        const userExist = await pool.query("select * from users where email =$1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({
                message: "user exist already"
            })
        }
        // hassed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // inser new user
        await pool.query(
            "insert into users (username,email,password)values($1,$2,$3)", [username, email, hashedPassword]
        );
        res.status(201).json({
            message: "user register successfully"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

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
            message: "login successfully", token
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

