import express from "express";
import usersRouter from "./routes/usersRouter.js";
import accountsRouter from "./routes/accountsRouter.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/accounts", accountsRouter);
app.use("*", (req, res) => res.send("hello"));
export default app;
