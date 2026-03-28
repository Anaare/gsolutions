import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllPayments = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM payments  ORDER BY id ASC");

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      payments: result.rows,
    },
  });
});

export const addPayment = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const {
    project_id,
    client_invoice_id,
    vendor_bill_id,
    amount,
    payment_type,
    status,
    payment_date,
    method,
  } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO payments ( project_id,
    client_invoice_id,
    vendor_bill_id,
    amount,
    payment_type,
    status,
    payment_date,
    method)
  VALUES ($1,$2, $3, $4,$5, $6, $7, $8)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [
    project_id,
    client_invoice_id,
    vendor_bill_id,
    amount,
    payment_type,
    status,
    payment_date,
    method,
  ];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      payment: result.rows[0],
    },
  });
});

export const getPayment = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM payments WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No payment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      payments: result.rows[0],
    },
  });
});

export const updatePayment = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE payments SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No payment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    payment: result.rows[0],
  });
});

export const deletePayment = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE payments SET status = $1 WHERE id = $2 RETURNING *",
    ["paid", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No payment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});
