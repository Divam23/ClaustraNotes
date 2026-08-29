import { asyncHandler } from '@/shared/utils/asyncHandler';
import { Request, Response } from 'express';
import { getAllBookmarks } from '../services/getAllBookmarks.service';
import { GetBookmarkOptions } from '../types/getAllBookmarkOptions.types';
import { mapBookmarkListResponse } from '../mappers/getAllBookmarks.mapper';
import { ApiResponse } from '@/shared/utils/ApiResponse';

export const getAllBookmarksController = asyncHandler(async (req: Request, res: Response) => {
    const firebaseUid = req.user?.firebaseUid as string;
    const options = req.query as unknown as GetBookmarkOptions;

    const result = await getAllBookmarks({ firebaseUid, options });

    const response = mapBookmarkListResponse({
        bookmarkNotes: result.bookmarks,
        pagination: result.pagination,
    });

    return res.status(200).json(
        new ApiResponse(
            200, 
            response, 
            'Bookmarks fetched successfully'
        )
    );
});
