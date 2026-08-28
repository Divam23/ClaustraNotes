import Note from '../notes.model';
import User from '@/modules/users/models/users.model';
import { ApiError } from '@/shared/utils/ApiError';

export const deleteSingleNote = async (firebaseUid: string, noteId: string) => {
    const user = await User.findOne({ firebaseUid }).lean();

    if (!user) {
        throw new ApiError(401, 'Unauthorized User');
    }

    const note = await Note.findById(noteId);

    if (!note) {
        throw new ApiError(404, 'No note found');
    }

    // ownership validation
    if (note.uploader.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You cannot delete this note');
    }

    //changing the delete status of file (soft deletion)
    try {
        await Note.findByIdAndUpdate(noteId, {
            $set:{
                'moderation.isDeleted': true,
                'moderation.deletedAt': new Date(),
                'moderation.deletedby': user._id,
                'moderation.deletionReason': null
            }
        })
        return {
            deleted: true,
            noteId,
        };
    } catch (error) {
        console.error('Deletion of the note failed', error);

        throw new ApiError(500, 'Failed to delete note files');
    }
};
