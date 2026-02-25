import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import answerRoutes from "./routes/answerRoute.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import dbconnection from "./DB/dbconfig.js";
import authMiddleware from "./middleware/authMiddleware.js";
import { initializeTables } from "./DB/initTables.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.send("API is running");
});

// question routes middleware
app.use("/api/question", authMiddleware, questionRoutes);

// userRoutes middleware
app.use("/api/user", userRoutes);

// chatRoutes middleware
app.use("/api/chat", authMiddleware, chatRoutes);

// answerRoutes middleware
app.use("/api/answer", authMiddleware, answerRoutes);

async function startServer() {
  try {
    // Test database connection
    const result = await dbconnection.query("SELECT NOW()");
    console.log("✅ Database connected successfully");

    // Initialize tables
    await initializeTables();

    app.listen(PORT);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

startServer();
