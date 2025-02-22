import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // this is the frontend server
    //   credentials: true,
    optionsSuccessStatus: 200,
  })
);

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import homeRouter from "./routes/home.routes.js";
app.use("/api/vpn", homeRouter);

export { app };
