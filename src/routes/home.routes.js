import Router from "express";
import { rejectGetRequest } from "../controllers/rejectGetRequest.controller.js";
import {
  createFeedback,
  createUser,
  getAllAppData,
  giveAccessToUser,
  updateUser,
} from "../controllers/user.controller.js";
import { isBanned } from "../middlewares/checkIsbanned.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

//routes
router
  .route("/access")
  .post(verifyJWT, isBanned, giveAccessToUser)
  .get(rejectGetRequest);
router
  .route("/createuser")
  .post(verifyJWT, isBanned, createUser)
  .get(rejectGetRequest);
router
  .route("/data")
  .post(verifyJWT, isBanned, getAllAppData)
  .get(rejectGetRequest);
router
  .route("/appupdate")
  .post(verifyJWT, isBanned, updateUser)
  .get(rejectGetRequest);
router
  .route("/feedback")
  .post(verifyJWT, isBanned, createFeedback)
  .get(rejectGetRequest);
router
  .route("/updateprofile")
  .post(verifyJWT, updateUser)
  .get(rejectGetRequest);

export default router;
