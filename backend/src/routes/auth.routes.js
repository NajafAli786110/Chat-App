import express from "express";
import { authCheck, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { checkUserLoggedInOrNot } from "../middleware/auth.middleware.js";
const AuthRouter = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/signup", signup);
AuthRouter.post("/logout", logout);
AuthRouter.post("/update-profile", checkUserLoggedInOrNot, updateProfile);
AuthRouter.get("/check", checkUserLoggedInOrNot, authCheck);

export { AuthRouter };
