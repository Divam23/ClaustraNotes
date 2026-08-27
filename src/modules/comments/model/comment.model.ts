import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types/comment.types';

const commentSchema = new Schema<IComment>(
    {
        note: {
            type: mongoose.Types.ObjectId,
            ref: 'Note',
            required: true,
            index: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        content: {
            type: String,
            min: 1,
            trim: true,
            maxlength: 1000,
        },
        parentComment: {
            type: mongoose.Types.ObjectId,
            ref: 'Comment',
            default: null,
            index: true,
        },
        stats: {
            likesCount: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            repliesCount: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
        },
        isEdited: {
            type: Boolean,
            default: false,
        },

        editedAt: {
            type: Date,
            default: null,
        },
        moderation: {
            isDeleted: {
                type: Boolean,
                default: false,
            },
            deletedAt: {
                type: Date,
                default: null,
            },
            deletedBy: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                default: null,
            },
        },
    },
    { timestamps: true }
);

commentSchema.index({
    note:1,
    parentComment:-1,
    createdAt:1
})

commentSchema.index({
    parentComment:1,
    createdAt:-1
})

commentSchema.index({
    "moderation.isDeleted":1
})

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;