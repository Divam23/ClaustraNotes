import { updateCommentOrReply } from "../services/updateComment.service";
import { Request, Response } from 'express';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { mapCommentResponse } from '../mappers/comment.mapper';
import { ApiError } from "@/shared/utils/ApiError";
import { UpdateCommentDto } from "../dto/updateComment.dto";

export const updateCommentController = asyncHandler(async(req:Request, res:Response)=>{
    const firebaseUid = req.user?.firebaseUid as string;
    const commentId = req.params.commentId as string;
    const commentData = req.body.comment as UpdateCommentDto;

    const result = await updateCommentOrReply({firebaseUid,commentData,commentId});

    if(!result) throw new ApiError(400, "No updates found");

    const mappedResponse = mapCommentResponse({
        comment: result,
        isOwner: true
    })

    return res.status(200).json(new ApiResponse(200, mappedResponse, "Comment updated successfully"));

})