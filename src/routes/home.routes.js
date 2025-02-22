import Router from "express";
import { rejectGetRequest } from "../controllers/rejectGetRequest.controller.js";
import {
  createFeedback,
  createUser,
  getAllAppData,
  giveAccessToUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

//routes
router.route("/access").post(verifyJWT, giveAccessToUser).get(rejectGetRequest);
router.route("/createuser").post(verifyJWT, createUser).get(rejectGetRequest);
router.route("/data").post(verifyJWT, getAllAppData).get(rejectGetRequest);
router.route("/appupdate").post(verifyJWT, updateUser).get(rejectGetRequest);
router.route("/feedback").post(verifyJWT, createFeedback).get(rejectGetRequest);
router
  .route("/updateprofile")
  .post(verifyJWT, updateUser)
  .get(rejectGetRequest);



export default router;
