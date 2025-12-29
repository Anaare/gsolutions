import mongoose, { Schema, Document } from "mongoose";
import type { User } from "../types/types.js";

/* 
    1. Create a "Super Type" that combines our custom User interface with Mongoose's Document methods.
   We Omit "_id" from our interface because Mongoose provides its own "ObjectId" type, 
   preventing a TypeScript conflict between a string and an Object. 
*/
export interface UserDocument extends Omit<User, "_id">, Document {}

// 2. Define User Schema
export const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add an email "],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      enum: ["Director", "Accountant", "Audit"],
      default: "Audit",
    },
  },
  { timestamps: true }
);

// 3. Creating a Model
const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
