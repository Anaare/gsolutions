import mongoose, { Schema, Document, Query } from "mongoose";
import type { User } from "../types/types.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface UserDocument extends Document, Omit<User, "_id"> {}

// // In your Model file or types file:
/* export interface UserDocument extends Document, Omit<User, "_id"> {
  // Explicitly defining methods here ensures 'this' context works perfectly
  comparePassword(candidate: string): Promise<boolean>;
  createPasswordResetToken(): string;
} */

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
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// SOFT DELETE (CHANGING ACTIVE STATUS)
userSchema.pre(/^find/, function (this: Query<any, UserDocument>) {
  this.where({ active: { $ne: false } });
});

// 1. PASSWORD HASHING
userSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password!, 12);
});

// 2. Update passwordChangedAt property
userSchema.pre("save", function (this: any) {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedAt = new Date(Date.now() - 1000);
});

// 3. Compare user provided password with one in DB
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 2. The Method Implementation
userSchema.methods.createPasswordResetToken = function (this: UserDocument) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and save it to the document
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiry (10 minutes)
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Return the UNHASHED token to be sent via email
  return resetToken;
};

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
