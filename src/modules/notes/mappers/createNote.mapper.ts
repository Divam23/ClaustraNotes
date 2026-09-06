import { IUser } from '@/modules/users/types/user.types';
import { INote } from '../types/note.types';

export const mapCreateNoteResponse = ({
    note,
    isLiked,
    isBookmarked,
    isOwner,
}: {
    note: INote;
    isLiked: boolean;
    isBookmarked: boolean;
    isOwner: boolean;
}) => {
    const uploader = note.uploader as unknown as IUser;

    return {
        id: note._id,
        title: note.title,
        description: note.description,
        subject: note.subject,
        category: note.category,
        tags: note.tags,
        course: note.course,
        branch: note.branch,
        college: note.collegeName,
        university: note.university,
        semester: note.semester,
        language: note.language,
        contentType: note.contentType,

        file: {
            size: note.file.size,
            mimeType: note.file.mimeType,
            pageCount: note.file.pageCount,
            canDownload: note.file.canDownload,
            readingTime: note.file.readingTime,
            thumbnailUrl: note.file.thumbnailUrl,
        },
        uploader: {
            id: uploader._id,
            firstName: uploader.firstName,
            lastName: uploader.lastName,
            userName: uploader.userName,
            avatar: uploader.avatar,
            verificationStatus: uploader.verificationStatus,
        },
        stats: {
            viewsCount: note.stats?.viewsCount ?? 0,
            downloadCount: note.stats?.downloadCount ?? 0,
            ratingsAverage: note.stats?.ratingsAverage ?? 0,
            ratingsCount: note.stats?.ratingsCount ?? 0,
            likesCount: note.stats?.likesCount ?? 0,
            bookmarksCount: note.stats?.bookmarksCount ?? 0,
        },
        isPublic: note.isPublic,
        noteVerificationStatus: note.noteVerificationStatus,
        notePublishStatus: note.notePublishStatus,
        publishedAt: note.publishedAt,

        isLiked: isLiked,
        isBookmarked: isBookmarked,
        isOwner: isOwner,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
    };
};