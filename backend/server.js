import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import jobRoutes from "./routes/job.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import errorHandler from "./middleware/errorhandler.js";
import { connectDB } from "./lib/db.js";



const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://mamcet-alumniconnect.netlify.app"
    ],
    credentials: true,
  })
);


app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});
