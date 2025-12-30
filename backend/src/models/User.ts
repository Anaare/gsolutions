import mongoose, { Schema, Document } from "mongoose";
import type { User } from "../types/types.js";
import bcrypt from "bcryptjs";

export interface UserDocument extends Omit<User, "_id">, Document {}

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
      select: false,
    },
    role: {
      type: String,
      enum: ["Director", "Accountant", "Audit"],
      default: "Audit",
    },
  },
  { timestamps: true }
);

// PASSWORD HASHING WITH BCRYPT
userSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password!, 12);
});

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
