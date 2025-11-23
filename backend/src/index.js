import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

import path from "path";

import { app, io, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json()); // This will allow us to extract json data out of the body
app.use(cookieParser()); //
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); //

app.use("/api/auth", authRoutes); // for api calls it will go to auth.route.js
app.use("/api/message", messageRoutes); // for api calls about messages it will go to auth.route.js

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.htmla"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running at PORT:" + PORT);
  connectDB();
});
