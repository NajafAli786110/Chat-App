import express from "express";
import { checkUserLoggedInOrNot } from "../middleware/auth.middleware.js";
import { getUserForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const MessageRouter = express.Router();

MessageRouter.get("/users", checkUserLoggedInOrNot, getUserForSidebar);
MessageRouter.get("/:id", checkUserLoggedInOrNot, getMessages);
MessageRouter.post("/send-message/:id", checkUserLoggedInOrNot, sendMessage);

export { MessageRouter };