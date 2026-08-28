import { ApiError } from '@/shared/utils/ApiError';
import Note from '../notes.model';
import User from '@/modules/users/models/users.model';
import mongoose from 'mongoose';
import Like from '@/modules/likes/model/like.model';
import Bookmark from '@/modules/bookmarks/model/bookmark.model';
import Download from '@/modules/downloads/model/download.model';

export const getSingleNoteData = async (firebaseUid: string, noteId: string) => {
    
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new ApiError(400, 'Invalid Note Id');
    }

    const user = await User.findOne({ firebaseUid }).select('_id').lean();

    const note = await Note.findById(noteId)
        .select(
            `   
            title description subject branch category collegeName tags course
            university semester language file contentType uploader
            stats createdAt updatedAt publishedAt isPublic notePublishStatus
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

    
    const isOwner = (user && note.uploader && '_id' in note.uploader && note.uploader._id.toString() === user._id.toString()) ?? false;
    
    const isDeleted = note.moderation?.isDeleted === true;
    
    if (isDeleted) {
        throw new ApiError(404, 'No note found');
    }
    
    const isPublishedAndPublic = note.isPublic && note.notePublishStatus === 'published';

    if (!isPublishedAndPublic && !isOwner) {
        throw new ApiError(403, 'You do not have access to this note!!!');
    }

    try {
        await Note.findByIdAndUpdate(noteId, {
            $inc: { 'stats.viewsCount': 1 },
            $set: { 'stats.lastViewedAt': new Date() },
        });

    } catch (error) {
        console.error('Failed to record note view', error);
    }

    let isLiked = false;
    let isBookmarked = false;
    let isDownloaded = false;

    if(user){
        const [like, bookmark, download] = await Promise.all([
            Like.exists({
                user: user._id,
                targetId: note._id,
                targetType: 'Note'
            }),

            Bookmark.exists({
                user: user._id,
                targetId: note._id,
                targetType: 'Note'
            }),

            Download.exists({
                user: user._id,
                note: note._id
            })

        ]);

        isLiked = !!like;
        isBookmarked = !!bookmark;
        isDownloaded = !!download;

    }


    return {
        note,
        isLiked,
        isBookmarked,
        isDownloaded,
        isOwner,
    };
};
