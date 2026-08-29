import { Request, Response } from "express";
import { deleteComment } from "../services/deleteComment.service";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { ApiError } from "@/shared/utils/ApiError";
import { ApiResponse } from "@/shared/utils/ApiResponse";

export const deleteCommentController = asyncHandler(async (req:Request, res:Response) => {
    const firebaseUid=req.user?.firebaseUid as string;
    const commentId = req.params.commentId as string;

    const result = await deleteComment({firebaseUid, commentId});

    return res.status(200).json(new ApiResponse(200, result, "Comment deleted successfully"));
})