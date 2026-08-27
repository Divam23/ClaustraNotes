import { requireVerifiedEmail } from "@/shared/middlewares/requireVerifiedEmail.middleware";
import { verifyFirebaseToken } from "@/shared/middlewares/verifyFirebaseToken.middleware";
import { Router } from "express";
import { getAllDownloadedNotesSchema } from "../validators/getAllDownloads.validation";
import { validate } from "@/shared/middlewares/validate.middleware";
import { getAllDownloadedNotesController } from "../controllers/getAllDownloadedNotes.controller";

const router = Router();

router.route('/').get(
    verifyFirebaseToken,
    requireVerifiedEmail,
    validate(getAllDownloadedNotesSchema),
    getAllDownloadedNotesController
)

export default router;