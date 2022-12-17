import { Router } from "express";
import * as utils from "../utils.js";
import * as operations from "../operations.js";
import { Account } from "../../models/account.js";
import { validateBody } from "../helpers.js";
const accountsRouter = Router();
export const OPS = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  TRANSFER: "transfer",
  FREE_CREDIT: "free credit",
  CHANGE_LIMIT: "change limit",
};
/**
 *
 * @param {Object} body
 * @param {Object} model
 */

accountsRouter.get("/", (req, res) => {
  try {
    res.status(200).json(utils.getAccounts());
  } catch (error) {
    res.status(404).json(error.message);
  }
});
accountsRouter.post("/", async (req, res) => {
  try {
    validateBody(req.body, Account);
    const newAccount = await Account.create(req.body);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(409).json(error.message);
  }
});
accountsRouter.get("/:id", (req, res) => {
  try {
    res.status(200).json(utils.getAccount(req.params.id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
accountsRouter.delete("/:id", (req, res) => {
  try {
    const deletedAccount = utils.deleteAccount(req.params.id);
    res.status(200).json(deletedAccount);
  } catch (error) {
    res.status(404).json(error.message);
  }
});
accountsRouter.post("/:id/:operation", (req, res) => {
  try {
    const {
      params: { id, operation },
      body,
    } = req;
    let response;
    const transaction = {
      type: operation,
      accountID: id,
      amount: body.amount,
      date: new Date(Date.now()),
    };
    switch (operation) {
      case OPS.DEPOSIT:
        response = operations.deposit(id, body.amount);
      case OPS.WITHDRAW:
        response = operations.withdraw(id, body.amount);
        break;
      case OPS.FREE_CREDIT:
        response = operations.freeCredit(id, body.amount);
        transaction.availableCredit = response.availableCredit;
        break;
      case OPS.CHANGE_LIMIT:
        response = operations.changeCreditLimit(id, body.newMaxCredit);
        break;
      case OPS.TRANSFER:
        response = operations.transfer(
          [id, body.receiverAccountID],
          body.amount
        );
        transaction.receiverAccountID = body.receiverAccountID;
        transaction.receiverName = utils.findUserByAccountID(
          body.receiverAccountID
        ).fullName;
        break;
      default:
        throw new Error("forbidden operation type!");
    }
    utils.addTransaction(transaction);
    res.status(201).json(response);
  } catch (error) {
    res.status(409).json(error.message);
  }
});
export default accountsRouter;
