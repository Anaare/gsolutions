import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllVendorsBills = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM vendors_bills ORDER BY id ASC");

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      vendors_bills: result.rows,
    },
  });
});

export const addVendorBill = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const { project_id, vendor_id, invoice_number, amount, description, status } =
    req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO vendors_bills (project_id, vendor_id, invoice_number, amount, description, status)
  VALUES ($1, $2,$3, $4, $5, $6)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [
    project_id,
    vendor_id,
    invoice_number,
    amount,
    description,
    status,
  ];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      vendor_bill: result.rows[0],
    },
  });
});

export const getVendorBill = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM vendors_bills WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No bill found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vendor_bill: result.rows[0],
    },
  });
});

export const updateVendorBill = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE vendors_bills SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No bill found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    vendor_bill: result.rows[0],
  });
});

export const deleteVendorBill = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE vendors_bills SET status = $1 WHERE id = $2 RETURNING *",
    ["paid", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No bill found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    vendor_bill: result.rows[0],
  });
});
