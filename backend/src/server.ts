import "./config/env.js";
import app from "./app.js";
import db from "./config/db.js";

const port = process.env.PORT || 8000;

db.query("SELECT NOW()")
  .then((res) => {
    console.log("🐘 PostgreSQL connection successful! ✅");
    console.log("Current DB Time:", res.rows[0].now);

    app.listen(port, () => {
      console.log(`🚀 App running on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error: 💥", err);
    process.exit(1); // Stop the app if we can't connect to the DB
  });
