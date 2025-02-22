import util from "util";
import connection from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Convert connection.query to return a promise
const query = util.promisify(connection.query).bind(connection);

const giveAccessToUser = asyncHandler(async (req, res, next) => {
  const tokenData = req.decodedToken;

  let userData = [];

  try {
    const device_id = tokenData.device_id;

    const results = await query(`SELECT * FROM app_users WHERE device_id = ?`, [
      device_id,
    ]);

    if (results.length === 0) {
      throw new ApiError(404, "User not found");
    }
    userData.push(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new ApiError(500, "Internal server error");
  }

  if (userData[0].is_banned == "active") {
    return res.status(403).json(new ApiResponse(403, {}, "User is banned"));
  }

  res.status(200).json(new ApiResponse(200, userData[0], "Access granted"));
});

// const updateData = asyncHandler(async (req, res, next) => {
//   try {
//     await query("UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'");
//     res.status(200).json(new ApiResponse(200, {}, "Data updated successfully"));
//   } catch (error) {
//     console.error("Error updating data:", error);
//     throw new ApiError(500, "Internal server error");
//   }
// });

const createUser = asyncHandler(async (req, res, next) => {
  const {
    device_id,
    id,
    city,
    country,
    ip,
    is_premium,
    is_banned,
    last_active,
    premium_buy_time,
    premium_end_time,
    is_admin_mailed_premium,
    payment_method,
    referer,
    refer_code,
    total_refer_claim,
    register_time,
    crash_report,
    is_rooted,
    email,
    name,
    last_connected_server,
    last_review,
    last_connection_duration,
    fcm,
    created_at,
    updated_at,
  } = req.decodedToken;

  try {
    const results = await query("SELECT * FROM app_users WHERE device_id = ?", [
      device_id,
    ]);

    if (results.length > 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, results[0], "User already exists"));
    }

    const insertResult = await query(
      "INSERT INTO app_users (device_id,id,city,country,ip, is_premium, is_banned,last_active,premium_buy_time,premium_end_time, is_admin_mailed_premium,payment_method,referer,refer_code,total_refer_claim,register_time,crash_report,is_rooted,email,name,last_connected_server,last_review,last_connection_duration,fcm, created_at,updated_at) VALUES (?, ?, ?, 'disabled', 'inactive')",
      [
        device_id,
        id,
        city,
        country,
        ip,
        is_premium,
        is_banned,
        last_active,
        premium_buy_time,
        premium_end_time,
        is_admin_mailed_premium,
        payment_method,
        referer,
        refer_code,
        total_refer_claim,
        register_time,
        crash_report,
        is_rooted,
        email,
        name,
        last_connected_server,
        last_review,
        last_connection_duration,
        fcm,
        created_at,
        updated_at,
      ]
    );

    const newUser = await query("SELECT * FROM app_users WHERE id = ?", [
      insertResult.device_id,
    ]);

    res
      .status(201)
      .json(new ApiResponse(201, newUser[0], "User created successfully"));
  } catch (error) {
    console.error("Error creating user:", error);
    throw new ApiError(500, "Internal server error");
  }
});

//fetch the tables that don't include user_id
const getAllAppData = asyncHandler(async (req, res) => {
  const { device_id } = req.decodedToken;

  const response = {
    status: 200,
    data: {},
    debug: {
      device_id,
    },
  };

  // Check premium status
  const userQuery =
    "SELECT is_premium FROM app_users WHERE device_id = ? LIMIT 1";
  const user = await query(userQuery, [device_id]);
  const isPremium = user[0]?.is_premium === "active";
  response.debug.is_premium = isPremium ? "premium" : "free";

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
    manual_payment_history: `SELECT * FROM manual_payment_requests WHERE device_id = ? ORDER BY id DESC`,
  };


  for (const [key, sqlQuery] of Object.entries(tables)) {
    let data;
    if (key === "manual_payment_history") {
      data = await query(sqlQuery, [device_id]);
    } else {
      data = await query(sqlQuery);
    }

    // Modify data for non-premium users
    if (
      !isPremium &&
      ["v2ray_servers", "openvpn_servers", "openconnect_servers"].includes(key)
    ) {
      data = data.map((row) => {
        if (row.mode === "pro") {
          if (key === "v2ray_servers") {
            return {
              ...row,
              config1: null,
              config2: null,
              config3: null,
              config4: null,
              config5: null,
            };
          } else if (key === "openvpn_servers") {
            return {
              ...row,
              udp_config: null,
              tcp_config: null,
              username: null,
              password: null,
            };
          } else if (key === "openconnect_servers") {
            return { ...row, ip_port: null, username: null, password: null };
          }
        }
        return row;
      });
    }

    response.data[key] = data;
  }

  res.json(response);
});

//updated user info in app_users table
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  const { device_id } = req.decodedToken;

  if (!device_id) {
    throw new ApiError(400, "Device ID is required");
  }

  try {
    //finfing user by device_id
    const user = await query("SELECT * FROM app_users WHERE device_id = ?", [
      device_id,
    ]);

    if (user.length === 0) {
      throw new ApiError(404, "User not found");
    }

    //updating name,email,...
    await query(
      "UPDATE app_users SET name = ?, email = ? WHERE device_id = ?",
      [name, email, device_id]
    );

    res
      .status(200)
      .json(new ApiResponse(200, { name, email }, "User updated successfully"));
  } catch (error) {
    console.error("Error updating user:", error);
    throw new ApiError(500, "Internal server error");
  }
});

//feedback
const createFeedback = asyncHandler(async (req, res, next) => {
  const { name, email, city, country, ip, device_id, review, star } = req.body;
  const created_at = new Date();
  const updated_at = new Date();

  if (!device_id || !review || !star) {
    throw new ApiError(400, "Device ID, review, and star rating are required");
  }

  try {
    await query(
      "INSERT INTO feedback (name, email, city, country, ip, device_id, review, star, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, city, country, ip, device_id, review, star, created_at, updated_at]
    );

    res.status(201).json(new ApiResponse(201, {}, "Feedback submitted successfully"));
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw new ApiError(500, "Internal server error");
  }
});

export { createUser, getAllAppData, giveAccessToUser, updateUser, createFeedback };
