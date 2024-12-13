import { User } from "../models/auth.model.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../config/cloudinaryConfig.js";
import { generateToken } from "../config/generateToken.js";

async function signup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(401)
      .json({ message: "Please Fill all Details Properly" });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 8);
    const newUser = {
      username,
      email,
      password: hashedPassword,
    };
    const user = await User.create(newUser);

    if (user) await generateToken(user._id, res);
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while creating new user", error });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Please Fill all Details Properly" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Username or password is not corrected" });

    const decodePassword = await bcryptjs.compare(password, user.password);
    if (!decodePassword)
      return res
        .status(400)
        .json({ message: "Username or password is not corrected" });

    if (decodePassword) {
      const token = await generateToken(user._id, res);
    }

    return res.status(200).json({ message: "User login successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while login user", error: error.message });
  }
}

async function logout(req, res) {
  try {
    res.cookie("sessionId", "", { maxAge: 0 });
    return res.status(201).json({ message: "User logout successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while logout user", error: error.message });
  }
}

async function updateProfile(req, res) {
  const { profilePic } = req.body;
  const userId = req.currUser._id;

  if (!profilePic) {
    return res.status(400).json({ message: "Please upload a file!" });
  }
  try {
    const uploadImage = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadImage.secure_url },
      { new: true }
    );

    return res.status(200).json({ message: "User Updated successfully" });
  } catch (error) {
    console.log("Error while updating user", error);
    return res.status(200).json({ message: "Error while updating user" });
  }
}

async function authCheck(req, res) {
  try {
    return res
      .status(200)
      .json({ message: `Current user is: ${req.currUser}` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "You're not logged in", error: error.message });
  }
}

export { signup, login, logout, updateProfile, authCheck };