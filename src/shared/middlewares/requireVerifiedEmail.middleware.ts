import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/utils/ApiError";

export const requireVerifiedEmail = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.firebaseUser?.email_verified) {
        return next(
            new ApiError(
                403,
                "Email verification required"
            )
        );
    }

    next();
};