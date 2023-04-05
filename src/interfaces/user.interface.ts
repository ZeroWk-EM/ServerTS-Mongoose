import { ObjectId } from "mongoose";
export interface IUser {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;
  verify?: string;
}

