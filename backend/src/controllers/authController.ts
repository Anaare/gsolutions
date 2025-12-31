import { RequestHandler } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { Email } from "../utils/email.js";
import crypto from "crypto";

// TOKEN GENERATION FUNCTIONALITY
export const signToken = (id: string): string => {
  const payload = { id };
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };

  return jwt.sign(payload, JWT_SECRET, options);
};

// Authentication Login (Sign up, login, restrictTo)

// 1. SIGN UP FUNCTIONALITY
export const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = await User.create({ name, email, password, role });

  if (!newUser) return next(new AppError("User creation failed", 400));

  const token = signToken(newUser._id.toString());

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    },
  });
});

// 2. LOGIN FUNCTIONALITY
export const login = catchAsync(async (req, res, next) => {
  // 1. Extracting email and password
  const { email, password } = req.body;
  // 2. Looking up user, explicitely selecting password because we have hidden it
  const user = await User.findOne({ email }).select("+password");
  //   3. Comparing user provided password and one that exists in DB
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).json({ message: "Invalid email or password" });
  const token = signToken(user._id.toString());
  res.json({ status: "success", token });
});

// 3. RESTRICT TO

export const restrictTo = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return next(new AppError("You do not have permission", 403));
    }

    next();
  };
};

// Password related logic (forgot, reset, update)
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  // 2. Generate the random reset token
  const resetToken = user?.createPasswordResetToken();

  // 3. Save to database (disabling validation for password/other fields)
  await user?.save({ validateBeforeSave: false });

  // 4. Send it via email (Logic to be added next)

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${resetToken}`;

    // Actually send the email
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // If email fails, reset the database fields!
    console.log("ERROR SENDING EMAIL: ", err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // 2) Find user with the hashed token and check if it hasn't expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  // 3) Check if user exists & token is valid
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 4) Update password & Clear reset fields
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // This triggers the pre('save') hooks for hashing and passwordChangedAt
  await user.save();

  // 5) Log the user in, send JWT
  const token = signToken(user._id.toString());

  res.status(200).json({
    status: "success",
    token,
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user and explicitly select password
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  // 2) Check if req.body.passwordCurrent exists
  if (!req.body.passwordCurrent) {
    return next(new AppError("Please provide your current password", 400));
  }

  // 3) Compare passwords
  const isCorrect = await user.comparePassword(req.body.passwordCurrent);

  if (!isCorrect) {
    return next(new AppError("Your current password is wrong", 401));
  }

  // 4) Update password
  user.password = req.body.password;
  await user.save();

  // 5) Log user in
  const token = signToken(user._id.toString());

  res.status(200).json({
    status: "success",
    token,
  });
});

// USER RELATED LOGIC: Get me, Update me, Delete me

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const deleteMe: RequestHandler = catchAsync(
  async (req: any, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  // 2) Filter body to only allow name and email
  const filteredBody: any = {};
  if (req.body.name) filteredBody.name = req.body.name;
  if (req.body.email) filteredBody.email = req.body.email;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});
