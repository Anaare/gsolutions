import db from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

/* 
Table vendors {
  name varchar [not null]
  id_number varchar [unique]

  is_vat_payer boolean

  email varchar
  phone varchar [note: 'either phone or email required']

  bank_account_number varchar
  bank_name varchar
  address text

  service_category_id integer [ref: > services.id]

  
}

*/

export const getAllVendors = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "SELECT * FROM vendors WHERE status = 'active' ORDER BY id ASC",
  );

  res.status(200).json({
    status: "success",
    results: result.rowCount,
    data: {
      vendors: result.rows,
    },
  });
});

export const addVendor = catchAsync(async (req, res, next) => {
  // 1. DESTRUCTURING DATA FROM THE REQUEST BODY
  const {
    name,
    identification_number,
    is_vat_payer,
    email,
    phone,
    bank_account_number,
    bank_name,
    address,
    service_category_id,
    status,
  } = req.body;

  // 2. PREPARE SQL STRING
  const queryText = `
  INSERT INTO vendors (name,
    identification_number,
    is_vat_payer,
    email,
    phone,
    bank_account_number,
    bank_name,
    address,
    service_category_id,
    status)
  VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *;
  `;

  // 3. PUTTING DATA INTO ARRAY IN AN EXACT ORDER
  const values = [
    name,
    identification_number,
    is_vat_payer,
    email,
    phone,
    bank_account_number,
    bank_name,
    address,
    service_category_id,
    status,
  ];

  // 4. EXECUTE
  const result = await db.query(queryText, values);

  // 5. SEND RESPONSE
  res.status(201).json({
    status: "success",
    data: {
      vendor: result.rows[0],
    },
  });
});

export const getVendor = catchAsync(async (req, res, next) => {
  const result = await db.query("SELECT * FROM vendors WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return next(new AppError("No vendor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vendor: result.rows[0],
    },
  });
});

export const updateVendor = catchAsync(async (req, res, next) => {
  const data = Object.keys(req.body);

  if (data.length === 0)
    return next(new AppError("Provide neccessary data", 400));
  const columns = data.map((key, i) => `${key} = $${i + 1}`);
  const setClause = columns.join(", ");
  const values = [...Object.values(req.body), req.params.id];
  const result = await db.query(
    `UPDATE vendors SET ${setClause} WHERE id = $${data.length + 1} RETURNING *`,
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

export const deleteVendor = catchAsync(async (req, res, next) => {
  const result = await db.query(
    "UPDATE vendors SET status = $1 WHERE id = $2 RETURNING *",
    ["inactive", req.params.id],
  );

  if (result.rows.length === 0) {
    return next(new AppError("No vendor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: result.rows[0],
  });
});
