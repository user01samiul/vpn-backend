import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.jwt;
    if (!jwt) throw new ApiError(401, "Unauthorized");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded.device_id) throw new ApiError(401, "Invalid token");
    req.decodedToken = decoded;
    next();
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid access token");
  }
});
