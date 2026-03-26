import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllEmployees = catchAsync(async (req, res, next) => {
  // 1. Swap Mongoose 'Employee.find()' for a Raw SQL Query
  const result = await db.query(
    "SELECT * FROM employees WHERE status = 'active' ORDER BY id ASC",
  );

  // 2. Send back the PostgreSQL rows
  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      employees: result.rows,
    },
  });
});

export const addEmployee = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const {
    full_name,
    email,
    personal_id,
    job_title,
    contract_salary,
    hire_date,
    bank_account,
  } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO employees (full_name, email, personal_id, job_title, contract_salary, hire_date, bank_account)
  VALUES ($1, $2,$3, $4, $5, $6, $7)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [
    full_name,
    email,
    personal_id,
    job_title,
    contract_salary,
    hire_date,
    bank_account,
  ];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      employees: result.rows[0],
    },
  });
});

export const getEmployee = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM employees WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No employee found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      employee: result.rows[0],
    },
  });
});

export const updateEmployee = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE employees SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No employee found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});

export const deleteEmployee = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE employees SET status = $1 WHERE id = $2 RETURNING *",
    ["inactive", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No employee found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});

// export const getAllEmployees = catchAsync(async (req, res, next) => {
//   const employees = await Employee.find();

//   res.status(200).json({
//     status: "success",
//     data: {
//       employees,
//     },
//   });
// });

// export const getEmployee = catchAsync(async (req, res, next) => {
//   const employee = await Employee.findById(req.params.id);

//   if (!employee)
//     return next(new AppError("There is not user with that id", 400));

//   res.status(200).json({
//     status: "success",
//     data: {
//       employee,
//     },
//   });
// });

// // Modifying AN EMPLOYEE WILL BE RESTRICTED TO ACCOUNTANT AND DIRECTOR
// export const addEmployee = catchAsync(async (req, res, next) => {
//   const { firstName, lastName, personalId, position, grossSalary } = req.body;
//   const newEmployee = await Employee.create({
//     firstName,
//     lastName,
//     personalId,
//     position,
//     grossSalary,
//   });

//   if (!newEmployee) return next(new AppError("User creation failed", 400));

//   res.status(201).json({
//     status: "success",
//     data: {
//       employee: newEmployee,
//     },
//   });
// });

// // I'll implement soft delete here as well, because info about past employees might be needed

// export const updateEmployee = catchAsync(async (req, res, next) => {
//   if (req.body.firstName || req.body.lastName || req.body.personalId) {
//     return next(
//       new AppError(
//         "This route is only for modifying position and/or salary of an employee.",
//         400
//       )
//     );
//   }
//   // 2. Find the document
//   const employee = await Employee.findById(req.params.id);

//   if (!employee) {
//     return next(new AppError("No employee found with that ID", 404));
//   }

//   // 3. Update the fields manually
//   if (req.body.position) employee.position = req.body.position;
//   if (req.body.grossSalary) employee.grossSalary = req.body.grossSalary;

//   // 4. Use .save() so the pre('save') middleware triggers!
//   await employee.save();

//   res.status(200).json({
//     status: "success",
//     data: { employee },
//   });
// });

// export const deleteEmployee = catchAsync(async (req, res, next) => {
//   await Employee.findByIdAndUpdate(req.params.id, { active: false });

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// export const restoreEmployee = catchAsync(async (req, res, next) => {
//   console.log("Requested personalId:", req.params.personalId);

//   console.log(
//     "Find ANY employee by personalId:",
//     await Employee.findOne({ personalId: req.params.personalId })
//   );

//   console.log(
//     "Find only inactive employee:",
//     await Employee.findOne({ personalId: req.params.personalId, active: false })
//   );

//   // Your existing test log
//   console.log(
//     await Employee.findOne({ personalId: "01011" }).select("+active")
//   );

//   const employee = await Employee.restoreByPersonalId(req.params.personalId);

//   if (!employee) return next(new AppError("No employee found", 404));

//   res.status(200).json({ status: "success", data: { employee } });
// });
