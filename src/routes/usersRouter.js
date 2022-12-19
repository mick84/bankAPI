import { Router } from "express";
import { User } from "../../models/user.js";
import { validateBody } from "../helpers.js";
import * as utils from "../utils.js";

const usersRouter = Router();

usersRouter.get("/", (req, res) => {
  try {
    const users = utils.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json(error.message);
  }
});
usersRouter.post("/", async (req, res) => {
  try {
    validateBody(req.body, User);
    const response = await User.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(409).json(error.message);
  }
});
usersRouter.post("/login", async (req, res) => {
  try {
    const { passportID, password } = req.body;
    const user = await User.login(passportID, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(409).json(error.message);
  }
});
usersRouter.get("/:passportID", async (req, res) => {
  try {
    const { passportID } = req.params;
    const user = await User.findOne({ passportID });

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

usersRouter.patch("/:id", (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    validateBody(body, User);
    const response = User.findByIdAndUpdate(id, body);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error.message);
  }
});
usersRouter.delete("/:id", async (req, res) => {
  try {
    const response = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error.message);
  }
});
usersRouter.get("/:id/accounts", (req, res) => {
  try {
    const user = utils.getUser(req.params.id);
    const accounts = utils.getUserAccounts(user.passportID);
    res.status(200).json(accounts);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

export default usersRouter;
