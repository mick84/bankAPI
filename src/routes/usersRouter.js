import { Router } from "express";
import * as utils from "../utils.js";

const usersRouter = Router();

usersRouter.get("/", (req, res) => {
  try {
    const users = utils.getUsers();
    res.status(200).json(users);
  } catch ({ message }) {
    res.status(404).send(message);
  }
});
usersRouter.post("/", (req, res) => {
  try {
    const { body } = req;
    const requiredFields = ["name", "balance", "credit", "passportID"];
    if (!requiredFields.some((f) => f in body)) {
      throw new Error("Missing data to create user!");
    }
    const response = utils.addUser(body);
    res.status(201).json(response);
  } catch ({ message }) {
    res.status(409).send(message);
  }
});
usersRouter.get("/:id", (req, res) => {
  try {
    res.status(200).json(utils.getUser(req.params.id));
  } catch ({ message }) {
    res.status(404).send(message);
  }
});

usersRouter.patch("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const response = utils.updateUser(id, req.body);
    res.status(200).json(response);
  } catch ({ message }) {
    res.status(404).send(message);
  }
});
usersRouter.delete("/:id", (req, res) => {
  try {
    const response = utils.deleteUser(req.params.id);
    res.status(200).json(response);
  } catch ({ message }) {
    res.status(404).send(message);
  }
});
usersRouter.get("/:id/accounts", (req, res) => {
  try {
    const user = utils.getUser(req.params.id);
    const accounts = utils.getUserAccounts(user.passportID);
    res.status(200).json(accounts);
  } catch ({ message }) {
    res.status(404).send(message);
  }
});

export default usersRouter;
