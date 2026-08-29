import { Request, Response } from 'express';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { mapCommentResponse } from '../mappers/comment.mapper';
import { getComments } from '../services/getComments.service';
import { IUser } from '@/modules/users/types/user.types';
import { IComment } from '../types/comment.types';

export const getAllTopLevelCommentsController = asyncHandler(async (req: Request, res: Response) => {
    const noteId = req.params.noteId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const currentFirebaseUid = req.user?.firebaseUid;

    const result = await getComments({ noteId, page, limit });

    const mappedComments = result.comments.map((comment) => {
        const user = comment.user as unknown as IUser;
        const isOwner = currentFirebaseUid ? user.firebaseUid === currentFirebaseUid : false;

        return mapCommentResponse({
            comment: comment as unknown as IComment,
            isOwner,
        });
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { 
                    comments: mappedComments, 
                    pagination: result.pagination 
                },
                'Comments fetched successfully'
            )
        );
});
