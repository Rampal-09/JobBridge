import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
import authRouter from "./Routes/authRoute.js";
import jobRouter from "./Routes/jobRoute.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on  http://localhost port ${process.env.PORT}`,
      );
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
