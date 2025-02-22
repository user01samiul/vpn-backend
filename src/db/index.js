import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "sami",
  password: "samiul99",
  database: "test",
});

export default connection;
