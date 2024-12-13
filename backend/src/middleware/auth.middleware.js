import jwt from "jsonwebtoken";
import { User } from "../models/auth.model.js";

export async function checkUserLoggedInOrNot(req, res, next) {
  try {
    const token = req.cookies.sessionId;
    if (!token) {
      return res.status(401).json({ message: "Please Login First!..." });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found!..." });
    }
    req.currUser = user;
    next();
  } catch (error) {
    console.log(`Error comes ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}
