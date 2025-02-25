import dotenv from "dotenv";
import mysql from "mysql";
import util from "util";
import { app } from "./app.js";
import connection from "./db/index.js"

dotenv.config({
  path: "./.env",
});


// Convert connection.query to return a promise
const query = util.promisify(connection.query).bind(connection);

// Function to connect to the database
function connectDB() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error("Could not connect to the database:", err);
        reject(err);
      } else {
        console.log("DB Connected!");
        resolve();
      }
    });
  });
}

// Function to fetch all app data every 5 minutes
async function fetchAllDataPeriodically() {
  console.log("Fetching all app data...");

  const tables = {
    app_updates: "SELECT * FROM app_updates",
    v2ray_servers: "SELECT * FROM v2rays WHERE status='active'",
    openvpn_servers: "SELECT * FROM open_v_p_n_s WHERE status='active'",
    openconnect_servers: "SELECT * FROM open_connects WHERE status='active'",
    languages: "SELECT * FROM languages WHERE status='active'",
    more_apps: "SELECT * FROM more_apps",
    custom_ads: "SELECT * FROM custom_ads WHERE is_expired='active'",
    admob_ads: "SELECT * FROM google_admobs WHERE id=1",
    notifications: "SELECT * FROM app_notifications ORDER BY created_at DESC",
    billing: "SELECT * FROM billings",
    manual_payment_methods: "SELECT * FROM manual_gateways",
  };

  const responseData = {};

  for (const [key, sqlQuery] of Object.entries(tables)) {
    try {
      const data = await query(sqlQuery);
      responseData[key] = data;
    } catch (error) {
      console.error(`Error fetching data from ${key}:`, error);
    }
  }

  console.log(
    "Fetched app data successfully at:",
    new Date().toLocaleTimeString()
  );
}

// Connect to DB and start the server
connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("Express server Error: ", err);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running on port", process.env.PORT || 8000);
    });

    // Fetch data once immediately
    fetchAllDataPeriodically();

    // Fetch data every 5 minutes (infinite loop)
    setInterval(fetchAllDataPeriodically, 5 * 60 * 1000);
  })
  .catch((error) => {
    console.log("Could not connect to the database", error);
    process.exit(1);
  });

export default connection;
