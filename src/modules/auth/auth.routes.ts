import express from "express";
import { authenticateUser } from "@/modules/auth/auth.controller";
import { verifyFirebaseToken } from "@/shared/middlewares/verifyFirebaseToken.middleware";
import { getCurrentUser } from "./auth.service";

const router = express.Router();

router.route("/login").post(verifyFirebaseToken, authenticateUser);

router.route("/me").get(verifyFirebaseToken, getCurrentUser);


export default router;