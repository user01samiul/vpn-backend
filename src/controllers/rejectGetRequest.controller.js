import { asyncHandler } from "../utils/asyncHandler.js";

export const rejectGetRequest = asyncHandler(async (req, res) => {
  try {
    res.destroy();
  } catch (error) {
    throw new ApiError(400, error?.message);
  }
});
