import { IUser } from '@/modules/users/types/user.types';
import { INote } from '../types/note.types';

export const mapNoteListResponse = ({
    notes,
    pagination,
}: {
    notes: INote[];
    pagination: {
        page: number;
        limit: number;
        totalResults: number;
        totalPages: number;
    };
}) => {
    const mappedNotes = notes.map((note) => {
        const uploader = note.uploader as unknown as IUser;

        return {
            id: note._id,
            title: note.title,
            subject: note.subject,
            category: note.category,
            tags: note.tags,
            course: note.course,
            university: note.university,
            semester: note.semester,
            language: note.language,
            contentType: note.contentType,
            file: {
                canDownload: note.file.canDownload,
                pageCount: note.file.pageCount,
                thumbnailUrl: note.file.thumbnailUrl,
            },

            uploader: {
                id: uploader._id,
                firstName: uploader.firstName,
                lastName: uploader.lastName,
                avatar: uploader.avatar,
                isVerified: uploader.verificationStatus,
            },

            stats: {
                viewsCount: note.stats?.viewsCount || 0,
                downloadCount: note.stats?.downloadCount || 0,
                ratingsAverage: note.stats?.ratingsAverage || 0,
                ratingsCount: note.stats?.ratingsCount || 0,
                likesCount: note.stats.likesCount || 0,
                bookmarksCount: note.stats.bookmarksCount || 0,
            },
            createdAt: note.createdAt,
        };
    });

    return {
        notes: mappedNotes,
        pagination,
    };
};
