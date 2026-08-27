import { BookmarkNoteAggregation } from "../types/bookmarkNoteAggregation.types";

export const mapBookmarkListResponse = ({
    bookmarkNotes,
    pagination
}: {
    bookmarkNotes: BookmarkNoteAggregation[];
    pagination:{
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
    };
}) => {
    const mappedBookmarks = bookmarkNotes.map((bookmark)=>{
        const note = bookmark.note;
        const uploader = bookmark.uploader;

        return {
            id: note._id,
            title: note.title,
            subject: note.subject,
            category: note.category,
            isPublic: note.isPublic,
            file: {
                canDownload: note.file.canDownload,
                pageCount: note.file.pageCount,
                thumbnailUrl: note.file.thumbnailUrl,
            },
            stats: {
                viewsCount: note.stats?.viewsCount ?? 0,
                downloadCount: note.stats?.downloadCount ?? 0,
                ratingsAverage: note.stats?.ratingsAverage ?? 0,
                ratingsCount: note.stats?.ratingsCount ?? 0,
                likesCount: note.stats?.likesCount ?? 0,
                bookmarksCount: note.stats?.bookmarksCount ?? 0,
                commentsCount: note.stats?.commentsCount ?? 0,
            },
            uploader:{
                id: uploader._id,
                firstName: uploader.firstName,
                lastName: uploader.lastName,
                avatar: uploader.avatar,
                verificationStatus: uploader.verificationStatus,
            },
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            bookmarkedAt: bookmark.createdAt,
            noteVerificationStatus: note.noteVerificationStatus,
            publishedAt: note.publishedAt,
        };
    });

    return {
        bookmarks: mappedBookmarks,
        pagination
    }
}