import express from "express";
import usersRouter from "./src/routes/usersRouter.js";
import accountsRouter from "./src/routes/accountsRouter.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", usersRouter);
app.use("/accounts", accountsRouter);
app.get("/", (req, res) => res.redirect("/users"));

app.listen(PORT, () =>
  console.log(`Bank API server is running on port ${PORT}`)
);
