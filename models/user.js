import { Schema, model, set } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
set("strictQuery", true);
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    validate(val) {
      if (val.match(/[^a-zA-Z]/g)) {
        throw new Error("Only letters allowed");
      }
    },
  },
  familyName: {
    type: String,
    required: true,
    validate(val) {
      if (val.match(/[^a-zA-Z]/g)) {
        throw new Error("Only letters allowed");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(val) {
      if (!validator.isStrongPassword(val)) {
        throw new Error("Please enter strong password");
      }
    },
  },
  passportID: {
    type: String,
    required: true,
    unique: true,
    validate(val) {
      if (val.match(/\D/g)) {
        throw new Error("Wrong passport ID format");
      }
    },
  },
  accountIDs: {
    type: [String],
    default: [],
  },
});
userSchema.pre("save", async function () {
  const hashed = await bcrypt.hash(this.password, +`${process.env.HASHROUNDS}`);
  this.$set("password", hashed);
});
userSchema.statics.login = async (passportID, password) => {
  try {
    const user = await User.findOne({ passportID });
    if (!user) {
      throw new Error(`User with passport ID ${passportID} does not exist.`);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error(`Wrong user password provided.`);
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};
export const User = model("User", userSchema);
