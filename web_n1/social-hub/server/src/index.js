import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Routes
import sessionRoutes from "./routes/session.js";
import feedRoutes from "./routes/feed.js";
import replyRoutes from "./routes/reply.js";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Rate limiter para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/session", authLimiter);

// Routes
app.use("/api/session", sessionRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/reply", replyRoutes);

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
