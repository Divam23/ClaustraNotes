import { ApiResponse } from '@/shared/utils/ApiResponse';
import { Request, Response } from 'express';
import { getNoteList } from '../services/getListOfNotes.service';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { mapNoteListResponse } from '../mappers/getListOfNotes.mapper';
import { NoteCategoryType } from '../constants/noteCategory.constant';
import { NoteContentType } from '../constants/noteContentType.constant';
import { getUserUploadedNotes } from '../services/getUserUploadedNotes.service';
import { ApiError } from '@/shared/utils/ApiError';
import { mapUserUploadedNotes } from '../mappers/getUserUploadedNotes.mapper';

export const getUserUploadedNotesController = asyncHandler(async (req: Request, res: Response) => {

            if (!req.user) {
                throw new ApiError(401, 'Unauthorized');
            }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const query = (req.query.q as string) || '';
    const subject = (req.query.subject as string) || undefined;
    const semester = req.query.semester ? Number(req.query.semester) : undefined;
    const category = (req.query.category as NoteCategoryType) || undefined;
    const course = (req.query.course as string) || undefined;
    const noteContentType = req.query.noteContentType as NoteContentType;

    const firebaseUid = req.user.firebaseUid;
    const options = { query, page, limit, subject, semester, category, course, noteContentType };

    const filteredNotes = await getUserUploadedNotes(
        {firebaseUid,
        options}
    );

    const response = mapUserUploadedNotes(filteredNotes); 

    return res.status(200).json(new ApiResponse(200, response, "Notes fetched successfully"));
});
