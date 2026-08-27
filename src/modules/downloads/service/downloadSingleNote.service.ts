import User from '@/modules/users/models/users.model';
import Note from '@/modules/notes/notes.model';
import { ApiError } from '@/shared/utils/ApiError';
import Download from '../model/download.model';
import firebaseProvider from '@/infrastructure/storage/providers/firebase.provider';
import mongoose from 'mongoose';

export const downloadSingleNote = async (firebaseUid: string, noteId: string) => {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const note = await Note.findById(noteId);
    if (!note) {
        throw new ApiError(404, 'No note found with this id');
    }

    if (note.notePublishStatus !== 'published') {
        throw new ApiError(403, 'This note is not published');
    }

    if (!note.file.canDownload) {
        throw new ApiError(403, 'Downloads are disabled for this note');
    }

    const isOwner = note.uploader.toString() === user._id.toString();

    if (!isOwner && !note.isPublic) {
        throw new ApiError(403, 'You do not have permission to download this note.');
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const download = await Download.create({
            user: user._id,
            note: note._id,
        });
        await download.save({session});

        await Note.findByIdAndUpdate(
            note._id,
            {
                $inc: {
                    'stats.downloadCount': 1,
                },
            },
            {session}
        );
        await session.commitTransaction();

    } catch (error: any) {
        session.abortTransaction();
        if (error.code !== 11000) {
            throw error;
        }
    }
    finally{
        session.endSession();
    }

    const signedUrl = await firebaseProvider.generateSignedDownloadUrl(note.file.storagePath);

    return {
        downloadUrl: signedUrl,
    };
};
