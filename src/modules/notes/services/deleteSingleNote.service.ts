import Note from '../notes.model';
import User from '@/modules/users/models/users.model';
import { ApiError } from '@/shared/utils/ApiError';
import firebaseStorageProvider from '@/infrastructure/storage/providers/firebase.provider';

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

    //try deleting file
    try {
        if (note.file?.storagePath) {
            await firebaseStorageProvider.deleteFile(note.file.storagePath);
        }

        if (note.file?.thumbnailUrl) {
            await firebaseStorageProvider.deleteFile(note.file.thumbnailUrl);
        }

        await Note.findByIdAndDelete(noteId);

        return {
            deleted: true,
            noteId,
        };
    } catch (error) {
        console.error('Firebase cleanup failed', error);

        throw new ApiError(500, 'Failed to delete note files');
    }
};
