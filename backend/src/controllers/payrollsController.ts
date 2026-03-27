import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllPayrolls = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "SELECT * FROM payrolls WHERE payroll_status = 'active' ORDER BY id ASC",
  );

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      payrolls: result.rows,
    },
  });
});

export const addPayroll = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const {
    employee_id,
    gross_salary,
    pension_member,
    health_insurance_tier,
    insurance_deduction,
    fitpass_deduction,
    other_deduction,
    pay_period_start,
    pay_period_end,
  } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO payrolls( employee_id,
    gross_salary,
    pension_member,
    health_insurance_tier,
    insurance_deduction, 
    fitpass_deduction,
    other_deduction,
    pay_period_start,
    pay_period_end)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [
    employee_id,
    gross_salary,
    pension_member,
    health_insurance_tier,
    insurance_deduction,
    fitpass_deduction,
    other_deduction,
    pay_period_start,
    pay_period_end,
  ];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      payroll: result.rows[0],
    },
  });
});

export const getPayroll = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM payrolls WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No payroll found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      payroll: result.rows[0],
    },
  });
});

export const updatePayroll = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE payrolls SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No payroll found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});

export const deletePayroll = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE payrolls SET payroll_status = $1 WHERE id = $2 RETURNING *",
    ["inactive", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No payroll found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});
