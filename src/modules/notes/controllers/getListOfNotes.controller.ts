import { ApiResponse } from '@/shared/utils/ApiResponse';
import { Request, Response } from 'express';
import { getNoteList } from '../services/getListOfNotes.service';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { mapNoteListResponse } from '../mappers/getListOfNotes.mapper';
import { NoteCategoryType } from '../constants/noteCategory.constant';

export const getNoteListController = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const query = (req.query.q as string) || '';
    const subject = (req.query.subject as string) || undefined;
    const semester = req.query.semester ? Number(req.query.semester) : undefined;
    const category = (req.query.category as NoteCategoryType) || undefined;
    const course = (req.query.course as string) || undefined;

    const notes = await getNoteList({ query, page, limit, subject, semester, category, course });

    const response = mapNoteListResponse(notes);

    return res.status(200).json(new ApiResponse(200, response, 'Notes fetched successfully'));
});
