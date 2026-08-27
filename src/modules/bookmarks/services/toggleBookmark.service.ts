import User from '@/modules/users/models/users.model';
import Bookmark from '../model/bookmark.model';
import Note from '@/modules/notes/notes.model';
import { ApiError } from '@/shared/utils/ApiError';
import { BookmarkEntityType } from '../constants/bookmarkEntityType.constant';
import mongoose from 'mongoose';

export const toggleBookmark = async(firebaseUid:string, targetType:BookmarkEntityType, targetId:string)=>{
    const user = await User.findOne({firebaseUid}).lean();

    if(!user) throw new ApiError(404, "User not found");

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const toggleExistingBookmark = async ()=>{
            const existingBookmark = await Bookmark.findOne({
                user: user._id,
                targetId,
                targetType,
                
            }).session(session).lean()
    
            if(existingBookmark){
                await Bookmark.findByIdAndDelete(existingBookmark._id, {session});
                return false;
            }
    
            await Bookmark.create([{
                user: user._id,
                targetId,
                targetType,
                
            }],{session})
    
            return true;
        }
        
        let result;

        if (targetType === 'Note') {
            const note = await Note.findById(targetId).session(session);
    
            if (!note) {
                throw new ApiError(404, 'Note not found');
            }
    
            const bookmarked = await toggleExistingBookmark();
    
            const updatedNote = await Note.findByIdAndUpdate(
                targetId,
                {
                    $inc: {
                        'stats.bookmarksCount': bookmarked ? 1 : -1,
                    },
                },
                {
                    new: true,
                }
            ).lean();
    
            result= {
                bookmarked,
                bookmarksCount: updatedNote?.stats?.bookmarksCount ?? 0,
            };
        }
        else{
            throw new ApiError(400, "Invalid target type!");
        }

        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally{
        await session.endSession();
    }
}