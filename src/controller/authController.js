import { success, ZodError } from "zod";
import { UserCreationValidation } from "../validation/zodValidaion.js";
import { pool } from "../config/db/db.js";
import bcrypt from "bcrypt";

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
