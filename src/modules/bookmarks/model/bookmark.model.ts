import mongoose, { Schema } from 'mongoose';
import { IBookmark } from '../types/bookmark.types';
import { BOOKMARK_ENTITY_TYPE_ENUM } from '../constants/bookmarkEntityType.constant';

const BookmarkSchema = new Schema<IBookmark>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetId: {
            type: Schema.Types.ObjectId,

            required: true,
        },

        targetType: {
            type: String,
            enum: BOOKMARK_ENTITY_TYPE_ENUM,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

BookmarkSchema.index(
    {
        user: 1,
        targetId: 1,
        targetType: 1,
    },
    {
        unique: true,
    }
);

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
export default Bookmark;
