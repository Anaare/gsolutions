import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllServices = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "SELECT * FROM services WHERE status = 'active' ORDER BY id ASC",
  );

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      services: result.rows,
    },
  });
});

export const addService = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const { name } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO services (name)
  VALUES ($1)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [name];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      service: result.rows[0],
    },
  });
});

export const getService = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM services WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No service found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      service: result.rows[0],
    },
  });
});

export const updateService = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE services SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No service found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});

export const deleteService = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE services SET status = $1 WHERE id = $2 RETURNING *",
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
