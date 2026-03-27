import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllClients = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "SELECT * FROM clients WHERE status = 'active' ORDER BY id ASC",
  );

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      clients: result.rows,
    },
  });
});

export const addClient = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const { name, email, service_category_id } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO clients (name, email, service_category_id)
  VALUES ($1, $2,$3)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [name, email, service_category_id];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      client: result.rows[0],
    },
  });
});

export const getClient = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM clients WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No client found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      client: result.rows[0],
    },
  });
});

export const updateClient = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE clients SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No client found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});

export const deleteClient = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE clients SET status = $1 WHERE id = $2 RETURNING *",
    ["inactive", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No client found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});
