import Comment from '../model/comment.model';
import User from '@/modules/users/models/users.model';
import Note from '@/modules/notes/notes.model';
import { ApiError } from '@/shared/utils/ApiError';
import mongoose from 'mongoose';

export const deleteComment = async ({
    firebaseUid,
    commentId,
}: {
    firebaseUid: string;
    commentId: string;
}) => {
    const user = await User.findOne({ firebaseUid }).lean();
    if (!user) throw new ApiError(404, 'User not found');

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, 'Comment not found');

    if (comment.user.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You can only delete your own comments');
    }

    if (comment.moderation?.isDeleted) {
        throw new ApiError(400, 'Cannot delete deleted comment');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        comment.moderation.isDeleted = true;
        comment.moderation.deletedBy = user._id;
        comment.moderation.deletedAt = new Date();
        await comment.save({session});

        await Note.findByIdAndUpdate(
            comment.note,
            {
                $inc: {
                    'stats.commentsCount': -1,
                },
            },
            { session }
        );

        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $inc: { 'stats.repliesCount': -1 },
            },{session});
        }
        await session.commitTransaction();
        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally{
        await session.endSession();
    }
};
