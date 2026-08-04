import User from '@/modules/users/models/users.model';
import Note from '@/modules/notes/notes.model';
import { ApiError } from '@/shared/utils/ApiError';
import Download from '../model/download.model';
import firebaseProvider from '@/infrastructure/storage/providers/firebase.provider';

export const downloadSingleNote = async (firebaseUid: string, noteId: string) => {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const note = await Note.findById(noteId);
    if (!note) {
        throw new ApiError(404, 'No note found with this id');
    }

    if (note.publishStatus !== 'published') {
        throw new ApiError(403, 'This note is not published');
    }

    if (!note.file.canDownload) {
        throw new ApiError(403, 'Downloads are disabled for this note');
    }

    const isOwner = note.uploader.toString() === user._id.toString();

    if (!isOwner && !note.isPublic) {
        throw new ApiError(403, 'You do not have permission to download this note.');
    }

    try {
        await Download.create({
            user: user._id,
            note: note._id,
        });

        await Note.findByIdAndUpdate(
            note._id,
            {
                $inc: {
                    'stats.downloadCount': 1,
                },
            },
        ).lean();
    } catch (error: any) {
        if (error.code !== 11000) {
            throw error;
        }
    }

    const signedUrl = await firebaseProvider.generateSignedDownloadUrl(note.file.storagePath);

    return {
        downloadUrl: signedUrl,
    };
};
