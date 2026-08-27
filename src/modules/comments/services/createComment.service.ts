import Comment from '../model/comment.model';
import User from '@/modules/users/models/users.model';
import Note from '@/modules/notes/notes.model';
import { ApiError } from '@/shared/utils/ApiError';
import { CreateCommentDto } from '../dto/createComment.dto';
import mongoose from 'mongoose';

export const createCommentOrReply = async ({
    firebaseUid,
    noteId,
    commentData,
}: {
    firebaseUid: string;
    noteId: string;
    commentData: CreateCommentDto;
}) => {
    const user = await User.findOne({ firebaseUid }).lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const note = await Note.findById(noteId).lean();

    if (!note) {
        throw new ApiError(404, 'Note not found');
    }
    let parentCommentDoc = null;

    if (commentData.parentComment) {
        parentCommentDoc = await Comment.findById(commentData.parentComment).lean();

        if (!parentCommentDoc) {
            throw new ApiError(404, 'Parent comment not found');
        }
        if (parentCommentDoc.note.toString() !== noteId) {
            throw new ApiError(400, 'Parent comment belongs to different note');
        }
        if (parentCommentDoc.parentComment !== null) {
            throw new ApiError(400, 'Replies to replies are not allowed');
        }
        if (parentCommentDoc.moderation?.isDeleted) {
            throw new ApiError(400, 'Cannot reply to deleted comment');
        }
    }

    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();

        const comment = await Comment.create({
            note: note._id,
            user: user._id,
            content: commentData.content,
            parentComment: commentData.parentComment || null,
        });
        await comment.save({session});

        await Note.findByIdAndUpdate(
            note._id, 
            {
                $inc: {
                    'stats.commentsCount': 1,
                },
            },
            {session}
        );
    
        if(parentCommentDoc !== null){
            await Comment.findByIdAndUpdate(parentCommentDoc._id, 
                {
                    $inc: { 'stats.repliesCount': 1 },
                },
                {session}
            );
        }
        await session.commitTransaction();

        //populate user from comment
        const populatedComment = await Comment.findById(comment._id).populate({
            path: 'user',
            select: [
                'firebaseUid',
                'firstName',
                'lastName',
                'userName',
                'avatar',
                'verificationStatus',
            ].join(' '),
        });

        return populatedComment;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally{
        await session.endSession();
    }

};
