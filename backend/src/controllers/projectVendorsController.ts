import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Table's purpose is to link specific project to their vendors

export const getAllProjectVendors = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "SELECT * FROM project_vendors ORDER BY id ASC",
  );

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      details: result.rows,
    },
  });
});

export const addprojectVendor = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const { project_id, vendor_id, total_contract_price } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO project_vendors ( project_id, 
    vendor_id,
    total_contract_price)
  VALUES ($1, $2,$3)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [project_id, vendor_id, total_contract_price];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      details: result.rows[0],
    },
  });
});

export const getProjectVendor = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM project_vendors WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No vendor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      details: result.rows[0],
    },
  });
});

export const updateProjectVendor = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE project_vendors SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
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

export const deleteProjectVendor = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE project_vendors SET status = $1 WHERE id = $2 RETURNING *",
    ["completed", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No vendor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});
