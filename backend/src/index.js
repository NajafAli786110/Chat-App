import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { AuthRouter } from "./routes/auth.routes.js";
import { MessageRouter } from "./routes/message.routes.js";
import { connectDB } from "./config/dbConnection.config.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;

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

app.listen(PORT, (req, res) => {
  console.log(`Server is started at PORT ${PORT}`);
});
