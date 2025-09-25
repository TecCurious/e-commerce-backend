import { success, ZodError } from "zod";
import {
  UserCreationValidation,
  loginUserValidation,
} from "../validation/zodValidaion.js";
import { pool } from "../config/db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Registration API
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // validation using Zod
    const parsedValue = UserCreationValidation.parse({
      firstName,
      lastName,
      email,
      password,
    });

    console.log("body parse value", parsedValue);

    //create user -> store user detils in db
    const client = await pool.connect();
    try {
      //step 1-> verify user exist or not
      const result = await client.query(
        "select * from users where email = $1",
        [parsedValue.email]
      );

      if (result.rows.length != 0) {
        return res
          .status(409)
          .json({ success: false, message: "user exist, plx login" });
      }

      //2 craete user
      //-> a. hash passowr
      console.log("salt roudn", 10);
      const hashPassword = await bcrypt.hash(parsedValue.password, 10);
      console.log("password", parsedValue.password);
      console.log("hasspasword", hashPassword);

      //-> store user in db
      const createdUserResult = await client.query(
        "insert into users (first_name, last_name, email, password) values ($1, $2, $3, $4) returning id",
        [firstName, lastName, email, hashPassword]
      );

      //console.log("created user", createdUserResult);

      //geting creatred user id
      const createdUser = createdUserResult.rows[0];

      //rturn the response with created user information except password
      res.status(201).json({
        success: true,
        message: "user created succesfully!",
        user: {
          id: createdUser.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
        },
      });
    } finally {
      // 7. Always release the client back to the pool
      client.release();
    }
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

export const loginUser = async (req, res) => {
  try {
    console.log("req body", req.body);
    const { email, password } = req.body;

    // validate input
    const parsedData = await loginUserValidation.parse({ email, password });

    const client = await pool.connect();
    try {
      // step 1: check if user exists
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length !== 1) {
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      }

      const user = result.rows[0];
      const hashPassword = user.password;

      // step 2: compare password
      const isPasswordValid = await bcrypt.compare(password, hashPassword);
      if (!isPasswordValid) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid credentials!" });
      }

      // step 3: create jwt token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
      );

      // step 4: return response
      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error while login user", error);

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed!" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

