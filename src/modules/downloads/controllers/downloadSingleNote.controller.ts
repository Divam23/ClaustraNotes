import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/shared/utils/ApiError';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { downloadSingleNote } from '../service/downloadSingleNote.service';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export const downloadSingleNoteController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(404, 'User not found');
        }

        const firebaseUid = req.user.firebaseUid;
        const noteId = req.params.noteId as string;

        const response = await downloadSingleNote(firebaseUid, noteId);

        return res.status(200).json(new ApiResponse(200, response, 'Note downloaded successfully'));
    }
);
