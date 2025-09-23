import { success, ZodError } from "zod";
import { UserCreationValidation } from "../validation/zodValidaion.js";
import {pool} from "../config/db/db.js"


// User Registration API
export const registerUser = async(req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation using Zod
    const parsedValue = UserCreationValidation.parse({
      username,
      email,
      password,
    });

    console.log("body parse value", parsedValue);

    //create user -> store user detils in db
    const client = await pool.connect();
    try {

      //verify user exist or not using email or username
      const user = await client.query("select * from users where email = $1 OR username = $2",[parsedValue.email, parsedValue.username]);

      if(user.rows.length != 0){
        res.status(409).json({success:false, message:"user already exixt!, plz login"});
      }



      console.log("user commig form db", user.rows);
      
    } catch (error) {
      console.log("db erro while",error)
    }
    




    // continue with user creation logic here...
    return res.status(201).json({ success: true, message: "User created successfully!" });

  } catch (error) {
    console.log("error while creation user", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    // Handle other server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
