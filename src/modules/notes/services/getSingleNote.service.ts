import { ApiError } from '@/shared/utils/ApiError';
import Note from '../notes.model';
import User from '@/modules/users/models/users.model';
import mongoose from 'mongoose';

export const getSingleNoteData = async (firebaseUid: string, noteId: string) => {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new ApiError(400, 'Invalid Note Id');
    }

    const note = await Note.findById(noteId)
        .select(
            `
            title description subject branch category collegeName tags course
            university semester language file contentType uploader
            stats createdAt updatedAt publishedAt isPublic publishStatus
            noteVerificationStatus moderation
        `
        )
        .populate(
            'uploader',
            `firstName lastName userName avatarUrl isEmailVerified userVerificationStatus`
        )
        .lean();

    if (!note) {
        throw new ApiError(404, 'No note found');
    }

    Note.findByIdAndUpdate(noteId, {
        $inc: { 'stats.viewsCount': 1 },
        $set: { 'stats.lastViewedAt': new Date() },
    }).catch(() => {});

    let isLiked = false;
    let isBookmarked = false;
    let isOwner = false;

    if (firebaseUid) {
        const currentUser = await User.findOne({ firebaseUid }).select('_id');

        if (currentUser) {
            const currentUserId = currentUser._id.toString();

            isOwner =
                note.uploader && '_id' in note.uploader
                    ? note.uploader._id.toString() === currentUserId
                    : false;
        }
    }
    return {
        note,
        isLiked,
        isBookmarked,
        isOwner,
    };
};
