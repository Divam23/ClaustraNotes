import { Request, Response } from 'express';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import * as noteService from '@/modules/notes/services/uploadNote.service';
import { ApiError } from '@/shared/utils/ApiError';
import { mapCreateNoteResponse } from '../mappers/createNote.mapper';

export const uploadNote = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(404, 'User not found');
    }

    if (!req.file) {
        throw new ApiError(400, 'Please choose the file you want to upload');
    }

    const note = await noteService.createNote({
        firebaseUid: req.user!.firebaseUid,
        noteData: req.body,
        uploadedFile: req.file,
    });

    const response = mapCreateNoteResponse({
        note: note,
        isLiked: false,
        isBookmarked: false,
        isOwner: true,
    });

    return res.status(201).json(
      new ApiResponse(
        201, 
        response,
        'Note Uploaded Successfully'
      )
    );
});
