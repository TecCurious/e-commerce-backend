import { ZodError } from "zod";
import { UserCreationValidation } from "../validation/zodValidaion.js";

// User Registration API
export const registerUser = (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation using Zod
    const parseValue = UserCreationValidation.parse({
      username,
      email,
      password,
    });

    console.log("body parse value", parseValue);

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
