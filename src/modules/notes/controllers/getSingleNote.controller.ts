import { Request, Response } from 'express';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { ApiError } from '@/shared/utils/ApiError';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { getSingleNoteData } from '../services/getSingleNote.service';
import { mapSingleNoteResponse } from '../mappers/getSingleNote.mapper';

export const getSingleNoteController = asyncHandler(
    async (
        req: Request, res: Response) => {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }

        const result = await getSingleNoteData(req.user.uid, req.params.noteId as string);

        const response = mapSingleNoteResponse({
            note: result.note,
            isLiked: result.isLiked,
            isBookmarked: result.isBookmarked,
            isDownloaded: result.isDownloaded,
            isOwner: result.isOwner,
        });

        return res.status(200).json(new ApiResponse(200, response, 'Note fetched successfully'));
    }
);
