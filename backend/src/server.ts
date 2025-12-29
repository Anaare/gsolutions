import "./config/env.js";

import app from "./app.js";
import mongoose from "mongoose";

const DB = process.env.DB!;
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful! ✅"))
  .catch((err) => console.error("DB connection error: 💥", err));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
