import { asyncHandler } from '@/shared/utils/asyncHandler';
import { Request, Response } from 'express';
import { toggleLike } from '../services/toggleLike.service';
import { ApiError } from '@/shared/utils/ApiError';
import { ApiResponse } from '@/shared/utils/ApiResponse';

export const toggleNoteLikeController = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(404, 'No user found');
    }

    const firebaseUid = req.user.uid;
    const noteId = req.params.noteId as string;



    const response = await toggleLike(
        firebaseUid,
        "Note",
        noteId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            response,
            'Like toggled successfully'
        )
    );
});