import { Request, Response } from 'express';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { deleteSingleNote } from '../services/deleteSingleNote.service';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export const deleteSingleNoteController = asyncHandler(async (req: Request, res: Response) => {
    const deletedResponse = await deleteSingleNote(req.user!.uid, req.params.noteId as string);

    return res.status(200).json(new ApiResponse(200, deletedResponse, 'Note deleted successfully'));
});
