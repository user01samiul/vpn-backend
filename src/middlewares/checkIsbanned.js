import util from "util";
import connection from "../index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isBanned = asyncHandler(async (req, res, next) => {
  const tokenData = req.decodedToken;
  const query = util.promisify(connection.query).bind(connection);

  let userData = [];

  try {
    const device_id = tokenData.device_id;

    const results = await query(`SELECT * FROM app_users WHERE device_id = ?`, [
      device_id,
    ]);

    if (results.length === 0) {
      res.status(200).json(new ApiResponse(200, {}, "User not found"));
    }
    userData.push(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new ApiError(500, "Internal server error");
  }

  if (userData[0].is_banned == "active") {
    return res.status(403).json(new ApiResponse(403, {}, "User is banned")); //res 2
  } else if (userData[0].is_banned == "disabled") {
    console.log("access granted");
    req.accessStatus = "granted";
    req.userData = userData;
    next(); //go to next middleware
  }
});
