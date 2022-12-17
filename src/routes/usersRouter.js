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
    res.status(404).json(error);
  }
});
usersRouter.post("/", async (req, res) => {
  try {
    validateBody(req.body, User);
    const response = await User.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(409).json(error);
  }
});
usersRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

usersRouter.patch("/:id", (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    validateBody(body, User);
    const response = utils.updateUser(id, body);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
});
usersRouter.delete("/:id", async (req, res) => {
  try {
    const response = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
});
usersRouter.get("/:id/accounts", (req, res) => {
  try {
    const user = utils.getUser(req.params.id);
    const accounts = utils.getUserAccounts(user.passportID);
    res.status(200).json(accounts);
  } catch (error) {
    res.status(404).json(error);
  }
});

export default usersRouter;
