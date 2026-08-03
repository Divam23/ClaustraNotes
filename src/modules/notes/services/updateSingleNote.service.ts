import User from '@/modules/users/models/users.model';
import Note from '../notes.model';
import { ApiError } from '@/shared/utils/ApiError';
import { UpdateSingleNoteDto } from '../dto/updateSingleNote.dto';
import mongoose from 'mongoose';

export const updateSingleNote = async ({
    firebaseUid,
    noteId,
    updatedNoteDataDetails,
}: {
    firebaseUid: string;
    noteId: string;
    updatedNoteDataDetails: UpdateSingleNoteDto;
}) => {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new ApiError(400, 'Invalid Note Id');
    }

    const user = await User.findOne({ firebaseUid }).lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    
    if (Object.keys(updatedNoteDataDetails).length === 0)
        throw new ApiError(400, 'No update details found');
    
    const note = await Note.findById(noteId);
    
    if (!note) throw new ApiError(404, 'No note found with this noteId');
    
    if (note.uploader.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You cannot update this note');
    }
    
    if (note.noteVerificationStatus === 'pending_review') {
        throw new ApiError(403,
            'This note is pending verification review and cannot be edited until the review is complete.'
        );
    }
    //returns document after update
    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedNoteDataDetails, {
        new:true,
        runValidators: true,
    });

    if(!updatedNote) throw new ApiError(404, "Failed to update note")

    return updatedNote;
};
