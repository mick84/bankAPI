import { Schema, model, set } from "mongoose";
import validator from "validator";
import uniqid from "uniqid";
import bcrypt from "bcrypt";
import { User } from "./user.js";
set("strictQuery", true);
const accountSchema = new Schema({
  accountID: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  ownerPassportID: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  cash: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  availableCredit: { type: Number, default: 0 },
});
accountSchema.pre("save", async function () {
  if (this.cash < 0 || this.credit < 0 || this.availableCredit > this.credit) {
    throw new Error("wrong account data provided");
  }
  if (!validator.isStrongPassword(this.password)) {
    throw new Error("Strong password required");
  }
  const hashed = await bcrypt.hash(this.password, +`${process.env.HASHROUNDS}`);

  this.$set("password", hashed);
  this.$set("accountID", uniqid());
});
accountSchema.post("save", async function () {
  try {
    await User.updateOne(
      { passportID: this.ownerPassportID },
      { $push: { accountIDs: this.accountID } }
    );
  } catch (error) {
    throw new Error(error);
  }
});
accountSchema.statics.login = async (accountID, password) => {
  try {
    const existingAccount = await Account.findOne({ accountID });
    if (!existingAccount) {
      throw new Error(`Account with ID ${accountID} does not exist!`);
    }
    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password
    );
    if (!passwordMatch) {
      throw new Error("Wrong account password provided");
    }
    return existingAccount;
  } catch (error) {
    throw new Error(error);
  }
};

export const Account = model("Account", accountSchema);
