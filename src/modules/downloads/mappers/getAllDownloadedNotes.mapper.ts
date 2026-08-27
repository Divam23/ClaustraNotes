import { DownloadedNoteAggregation } from "../types/downloadedNotesAggregation.types";

export const mapDownloadedNotesResponse = ({
    downloadedNotes,
    pagination
}: {
    downloadedNotes: DownloadedNoteAggregation[];
    pagination:{
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
    };
}) => {
    const mappedDownloadedNotes = downloadedNotes.map((downloadedNote)=>{
        const note = downloadedNote.note;
        const uploader = downloadedNote.uploader;

        return {
            id: note._id,
            title: note.title,
            subject: note.subject,
            category: note.category,
            description: note.description,
            tags: note.tags,
            isPublic: note.isPublic,
            file: {
                canDownload: note.file.canDownload,
                pageCount: note.file.pageCount,
                thumbnailUrl: note.file.thumbnailUrl,
            },
            stats: {
                viewsCount: note.stats?.viewsCount ?? 0,
                downloadCount: note.stats?.downloadCount ?? 0,
                likesCount: note.stats?.likesCount ?? 0,

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
            downloadedAt: downloadedNote.createdAt,
            noteVerificationStatus: note.noteVerificationStatus,
            publishedAt: note.publishedAt,
        };
    });

    return {
        downloadedNotes: mappedDownloadedNotes,
        pagination
    }
}