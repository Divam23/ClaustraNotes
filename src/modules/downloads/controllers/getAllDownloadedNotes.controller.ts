import { Request, Response } from 'express';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { GetDownloadedNotesOptions } from '../types/getAllDownloads.types';
import { getAllDownloadedNotes } from '../service/getAllDownloadedNotes.service';
import { mapDownloadedNotesResponse } from '../mappers/getAllDownloadedNotes.mapper';

export const getAllDownloadedNotesController = asyncHandler(async (req: Request, res: Response) => {
    const firebaseUid = req.user?.uid as string;
    const options = req.query as unknown as GetDownloadedNotesOptions;

    const result = await getAllDownloadedNotes({ firebaseUid, options });

    const mappedResponse = mapDownloadedNotesResponse({
        downloadedNotes: result.downloads,
        pagination: result.pagination,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, mappedResponse, 'Downloads fetched successfully'));
});
