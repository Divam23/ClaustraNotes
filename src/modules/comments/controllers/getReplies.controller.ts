import { Request, Response } from 'express';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { mapCommentResponse } from '../mappers/comment.mapper';
import { getRepliesOnComments } from '../services/getReplies.service';
import { IUser } from '@/modules/users/types/user.types';
import { IComment } from '../types/comment.types';

export const getRepliesOnCommentsController = asyncHandler(async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const currentFirebaseUid = req.user?.firebaseUid;

    const result = await getRepliesOnComments({ commentId, page, limit });

    const mappedReplies = result.replies.map((reply) => {
        const user = reply.user as unknown as IUser;
        const isOwner = currentFirebaseUid ? user.firebaseUid === currentFirebaseUid : false;

        return mapCommentResponse({
            comment: reply as unknown as IComment,
            isOwner,
        });
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                replies: mappedReplies,
                pagination: result.pagination,
            },
            'Replies fetched successfully'
        )
    );
});
