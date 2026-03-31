import postgres from "postgres";

const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "fullstack_db",
  username: "postgres",
  password: "123123",
});

export default sql;