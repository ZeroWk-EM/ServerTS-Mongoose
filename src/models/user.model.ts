import { IUser } from "../interfaces/user.interface";
import { Schema, model } from "mongoose";

const User = new Schema<IUser>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verify: { type: String, required: false },
  },
  { versionKey: false, timestamps: true }
);

export default model<IUser>("users", User);
