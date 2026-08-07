import { INote } from '../types/note.types';

export const mapUserUploadedNotes = ({
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
    const mappedNotes = notes.map((note)=>{
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
                viewsCount: note.stats?.viewsCount || 0,
                downloadCount: note.stats?.downloadCount || 0,
                ratingsAverage: note.stats?.ratingsAverage || 0,
                ratingsCount: note.stats?.ratingsCount || 0,
                likesCount: note.stats?.likesCount || 0,
                bookmarksCount: note.stats?.bookmarksCount || 0,
                commentsCount: note.stats?.commentsCount || 0,
            },
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            notePublishStatus: note.notePublishStatus,
            noteVerificationStatus: note.noteVerificationStatus,
            publishedAt: note.publishedAt,
            submittedForReviewAt: note.submittedForReviewAt,
            approvedAt: note.approvedAt,
            rejectedAt: note.rejectedAt,
            rejectionReason: note.rejectionReason
        };
    });

    return {
        notes: mappedNotes,
        pagination
    }
}
