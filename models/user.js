import { Schema, model, set } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
set("strictQuery", true);
const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    validate(val) {
      if (val.match(/[^a-zA-Z]/g)) {
        throw new Error("Only letters allowed");
      }
    },
  },
  lastname: {
    type: String,
    required: true,
    validate(val) {
      if (val.match(/[^a-zA-Z]/g)) {
        throw new Error("Only letters allowed");
      }
    },
  },
  email: {
    type: String,
    required: true,
    validate(input) {
      if (!validator.isEmail(input)) {
        throw new Error("invalid email provided.");
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
userSchema.pre("save", async function (next) {
  // console.log("this", this);
  const usr = await User.findOne({
    $or: [{ email: this.email }, { passportID: this.passportID }],
  });
  if (usr) {
    throw new Error("given email or passportID is already in use");
  }
  const hashed = await bcrypt.hash(this.password, +`${process.env.HASHROUNDS}`);
  this.$set("password", hashed);
  next();
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
    throw new Error(error.message);
  }
};

export const User = model("User", userSchema);
