import User from '@/modules/users/models/users.model';
import Note from '../notes.model';
import { INote } from '../types/note.types';
import { ApiError } from '@/shared/utils/ApiError';
import { QueryFilter } from 'mongoose';
import { GetNoteListOptions } from '../types/getNoteListOptions.types';

export const getUserUploadedNotes = async ({
    firebaseUid,
    options
}: {
    firebaseUid: string;
    options: GetNoteListOptions
}) => {
    const user = await User.findOne({ firebaseUid }).lean();

    if (!user) {
        throw new ApiError(404, 'User not found!!!');
    }

    const filters: QueryFilter<INote> = {
        uploader: user._id,
    }

    const skip = (options.page -1) * options.limit;

    if(options.category){
        filters.category = options.category
    }

    if(options.noteContentType){
        filters.contentType = options.noteContentType;
    }


    const totalResults = await Note.countDocuments(filters);

    const notes = await Note.find(filters).select(
        `title subject category uploader stats file createdAt updatedAt isPublic notePublishStatus noteVerificationStatus publishedAt submittedForReviewAt approvedAt rejectedAt rejectionReason`
    )
    .sort({createdAt: -1})
    .skip(skip)
    .limit(options.limit)
    .lean();

    return {
        notes,
        pagination:{
            page: options.page,
            limit: options.limit,
            totalResults,
            totalPages: Math.ceil(totalResults/options.limit),
        }
    }

};
