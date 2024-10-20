// db.js ECMAScript
import pg from "pg";
// ตั้งค่าการเชื่อมต่อกับฐานข้อมูล PostgreSQL
const { Pool } = pg;
const pool = new Pool({
  user: "adminstudent",
  host: "localhost",
  database: "checkstd",
  password: "password",
  port: 5432,
});
await pool
  .connect()
  .then(() => console.log("Connect To Database Success"))
  .catch((err) => console.error("Error" + err.message));
export default pool;
// module.exports = pool;
