import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// I'll add logic for filtering Projects based on their status.. Active, In progress, Completed

export const getAllProjects = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM projects  ORDER BY id ASC");

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      projects: result.rows,
    },
  });
});

export const addProject = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const {
    client_id,
    service_category_id,
    total_contract_price,
    status,
    start_date,
    end_date,
  } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO projects ( client_id,
    service_category_id,
    total_contract_price,
    status,
    start_date,
    end_date)
  VALUES ($1, $2,$3, $4, $5, $6)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [
    client_id,
    service_category_id,
    total_contract_price,
    status,
    start_date,
    end_date,
  ];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      project: result.rows[0],
    },
  });
});

export const getProject = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM projects WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      project: result.rows[0],
    },
  });
});

export const updateProject = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE projects SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
    values,
  );

  if (result.rows.length === 0) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});

export const deleteProject = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE vendors SET status = $1 WHERE id = $2 RETURNING *",
    ["completed", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});
