import Employee from "../models/Employee.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllEmployees = catchAsync(async (req, res, next) => {
  const employees = await Employee.find();

  res.status(200).json({
    status: "success",
    data: {
      employees,
    },
  });
});

export const getEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee)
    return next(new AppError("There is not user with that id", 400));

  res.status(200).json({
    status: "success",
    data: {
      employee,
    },
  });
});

// Modifying AN EMPLOYEE WILL BE RESTRICTED TO ACCOUNTANT AND DIRECTOR
export const addEmployee = catchAsync(async (req, res, next) => {
  const { firstName, lastName, personalId, position, grossSalary } = req.body;
  const newEmployee = await Employee.create({
    firstName,
    lastName,
    personalId,
    position,
    grossSalary,
  });

  if (!newEmployee) return next(new AppError("User creation failed", 400));

  res.status(201).json({
    status: "success",
    data: {
      employee: newEmployee,
    },
  });
});

// I'll implement soft delete here as well, because info about past employees might be needed

export const updateEmployee = catchAsync(async (req, res, next) => {
  if (req.body.firstName || req.body.lastName || req.body.personalId) {
    return next(
      new AppError(
        "This route is only for modifying position and/or salary of an employee.",
        400
      )
    );
  }
  // 2. Find the document
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new AppError("No employee found with that ID", 404));
  }

  // 3. Update the fields manually
  if (req.body.position) employee.position = req.body.position;
  if (req.body.grossSalary) employee.grossSalary = req.body.grossSalary;

  // 4. Use .save() so the pre('save') middleware triggers!
  await employee.save();

  res.status(200).json({
    status: "success",
    data: { employee },
  });
});

export const deleteEmployee = catchAsync(async (req, res, next) => {
  await Employee.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const restoreEmployee = catchAsync(async (req, res, next) => {
  console.log("Requested personalId:", req.params.personalId);

  console.log(
    "Find ANY employee by personalId:",
    await Employee.findOne({ personalId: req.params.personalId })
  );

  console.log(
    "Find only inactive employee:",
    await Employee.findOne({ personalId: req.params.personalId, active: false })
  );

  // Your existing test log
  console.log(
    await Employee.findOne({ personalId: "01011" }).select("+active")
  );

  const employee = await Employee.restoreByPersonalId(req.params.personalId);

  if (!employee) return next(new AppError("No employee found", 404));

  res.status(200).json({ status: "success", data: { employee } });
});
