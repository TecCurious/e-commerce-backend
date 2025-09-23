import {ZodError } from "zod";
import { UserRegisterValidation } from "../validation/zodValidation.js";
import { pool } from "../config/db.js";


// user register api
export const registerUser=async(req,res)=>{
try {
    const {username,email,password}=req.body;

    // validation using zod
    const parsedValue=UserRegisterValidation.parse({
        username,
        email,
        password,
    })
    console.log("parse value:",parsedValue);


    // create user store details in db
    const client=await pool.connect();
    try {
        // verify user exist or not using username,email
        const user=await client.query("select * from users where email=$1 OR username=$2",[parsedValue.email,parsedValue.username]);
        if(user.rows.length>0){
            res.status(409).json({
                success:false,
                Message:"user already exist !,plz login"
            });
        }
        console.log("user comming from db",user.rows);
    } catch (error) {
        console.log("error is:",error);
    }

    // continue with user cretion logic here
    return res.status(201).json({success:true,message:"user created successfully!"});
} catch (error) {
    console.log("error while create user:",error);
    if(error instanceof ZodError){
        return res.status(400).json({
            success:false,
            message:"validation failed",
        })
    }

    // handle other server error
    res.status(500).json({
        success:false,
        message:"internal server error",
    })
}
}

export const loginUser=async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
