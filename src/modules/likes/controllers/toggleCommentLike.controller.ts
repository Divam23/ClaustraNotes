import { asyncHandler } from '@/shared/utils/asyncHandler';
import { Request, Response } from 'express';
import { toggleLike } from '../services/toggleLike.service';
import { ApiError } from '@/shared/utils/ApiError';
import { ApiResponse } from '@/shared/utils/ApiResponse';

export const toggleCommentLikeController = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(404, 'No user found');
    }

    const firebaseUid = req.user.firebaseUid;
    const commentId = req.params.commentId as string;

    const response = await toggleLike(
        firebaseUid,
        "Comment",
        commentId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            response,
            'Like toggled successfully'
        )
    );
});