import { Request, Response } from 'express';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { updateSingleNote } from '../services/updateSingleNote.service';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { UpdateSingleNoteDto } from '../dto/updateSingleNote.dto';
import { ApiError } from '@/shared/utils/ApiError';
import { mapUpdateNoteResponse } from '../mappers/updateSingleNote.mapper';

export const updateSingleNoteController = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User not found');

    const firebaseUid = req.user.uid;
    const noteId = req.params.noteId as string;
    const updatedNoteDataDetails = req.body as UpdateSingleNoteDto;

    const updatedNote = await updateSingleNote({
        firebaseUid,
        noteId,
        updatedNoteDataDetails,
    });


    const response = mapUpdateNoteResponse({
        note: updatedNote,
        isLiked: false,
        isBookmarked: false,
        isOwner: true,
    })

    return res
        .status(200)
        .json(new ApiResponse(200, response, 'Note Details Updated Successfully'));
});
