import { Schema, model, set } from "mongoose";
import { OPS } from "../src/routes/accountsRouter.js";
import { Account } from "./account.js";
import { User } from "./user.js";
set("strictQuery", true);
const transactionSchema = new Schema({
  type: {
    String,
    required: true,
  },
  senderAccountID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  receiverAccountID: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
});
transactionSchema.pre("save", async function () {
  if (!(this.type in OPS)) {
    throw new Error("Invalid operation type!");
  }
  if (this.amount < 0) {
    throw new Error("Amount must be strictly positive");
  }
  const receiverAccount = await Account.findOne({
    accountID: this.receiverAccountID,
  });
  if (!receiverAccount) {
    throw new Error(
      `Receiver with account ID ${this.receiverAccountID} does not exist.`
    );
  }
  const receiver = await User.findOne({
    passportID: receiverAccount.ownerPassportID,
  });
  this.$set("receiverName", `${receiver.familyName} ${receiver.firstName}`);
});

export const Transaction = model("Transaction", transactionSchema);
