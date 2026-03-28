import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllClientInvoices = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "SELECT * FROM client_invoices ORDER BY id ASC",
  );

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      client_invoices: result.rows,
    },
  });
});

export const addClientInvoice = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const { project_id, client_id, invoice_number, amount, description } =
    req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO client_invoices (project_id, client_id, invoice_number, amount, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [project_id, client_id, invoice_number, amount, description];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      client_invoices: result.rows[0],
    },
  });
});

export const getClientInvoice = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM client_invoices WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No invoice found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      client_invoices: result.rows[0],
    },
  });
});

export const updateClientInvoice = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE client_invoices SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No invoice found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    client_invoice: result.rows[0],
  });
});

export const deleteClientInvoice = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE client_invoices SET status = $1 WHERE id = $2 RETURNING *",
    ["paid", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No invoice found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    client_invoice: result.rows[0],
  });
});
