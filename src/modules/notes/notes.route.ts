import { Router } from 'express';
import { uploadNote } from '@/modules/notes/controllers/uploadNote.controller';
import { validate } from '@/shared/middlewares/validate.middleware';
import { verifyFirebaseToken } from '@/shared/middlewares/verifyFirebaseToken.middleware';
import { noteUpload } from '@/shared/middlewares/multer.middleware';
import { createNoteSchema } from './validators/createNote.validators';
import { getSingleNoteController } from './controllers/getSingleNote.controller';
import { getNoteListController } from './controllers/getListOfNotes.controller';
import { deleteNoteSchema } from './validators/deleteNote.validators';
import { deleteSingleNoteController } from './controllers/deleteSingleNote.controller';
import { getNoteIdSchema } from './validators/getNoteIdSchema.validator';
import { updateSingleNoteController } from './controllers/updateSingleNote.controller';
import { updateNoteSchema } from './validators/updateNote.validatiors';
import { getCommentsSchema } from '../comments/validators/getComments.validation';
import { getAllTopLevelCommentsController } from '../comments/controllers/getComments.controller';
import { createCommentSchema } from '../comments/validators/createComment.validation';
import { createCommentController } from '../comments/controllers/createComment.controller';
import { toggleNoteLikeController } from '../likes/controllers/toggleNoteLike.controller';
import { requireVerifiedEmail } from '@/shared/middlewares/requireVerifiedEmail.middleware';
import { downloadSingleNoteSchema } from '../downloads/validators/download.validation';
import { downloadSingleNoteController } from '../downloads/controllers/downloadSingleNote.controller';
import { toggleLikeSchema } from '../likes/validators/toggleLike.validation';
import { getUserIdSchema } from '../users/validators/getUserIdSchema.validation';
import { getUserUploadedNotesController } from './controllers/getUserUploadedNotes.controller';
import { getUserUploadedNotesSchema } from './validators/getUserUploadedNotesSchema.validator';

const router = Router();

//PUBLIC ROUTES
router.route('/feed').get(getNoteListController);

//PRIVATE ROUTES
//Comment route
router
    .route('/:noteId/comments')
    .get(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(getCommentsSchema),
        getAllTopLevelCommentsController
    );
router
    .route('/create')
    .post(
        verifyFirebaseToken,
        requireVerifiedEmail,
        noteUpload.single('file'),
        validate(createNoteSchema),
        uploadNote
    );
router
    .route('/:noteId')
    .get(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(getNoteIdSchema),
        getSingleNoteController
    );
router
    .route('/delete/:noteId')
    .delete(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(deleteNoteSchema),
        deleteSingleNoteController
    );
router
    .route('/:noteId')
    .patch(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(getNoteIdSchema),
        validate(updateNoteSchema),
        updateSingleNoteController
    );
router
    .route('/:noteId/comments')
    .post(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(createCommentSchema),
        createCommentController
    );
router
    .route('/:noteId/like')
    .post(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(toggleLikeSchema),
        toggleNoteLikeController
    );
//Download route
router
    .route('/:noteId/download')
    .post(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(downloadSingleNoteSchema),
        downloadSingleNoteController
    );

//User uploaded notes
router
    .route('/me')
    .get(
        verifyFirebaseToken,
        requireVerifiedEmail,
        validate(getUserUploadedNotesSchema),
        getUserUploadedNotesController
    );

export default router;
