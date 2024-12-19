import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { AuthRouter } from "./routes/auth.routes.js";
import { MessageRouter } from "./routes/message.routes.js";
import { connectDB } from "./config/dbConnection.config.js";
import { app, server } from "./config/socket.js";
import path from "path"

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// DB Connect
connectDB();

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/message", MessageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

server.listen(PORT, (req, res) => {
  console.log(`Server is started at PORT ${PORT}`);
});
