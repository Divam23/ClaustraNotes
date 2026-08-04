import { ApiError } from '@/shared/utils/ApiError';
import Note from '../notes.model';

type GetNoteListOptions = {
    query?: string;
    page: number;
    limit: number;
    subject?: string;
    semester?: number;
    category?: string;
    course?: string;
};

export const getNoteList = async (options: GetNoteListOptions) => {
    const filters: any = {
        isPublic: true,
        status: 'published',
    };

    const skip = (options.page - 1) * options.limit;

    if (options.query) {
        filters.$or = [
            {
                title: {
                    $regex: options.query,
                    $options: 'i',
                },
            },

            {
                subject: {
                    $regex: options.query,
                    $options: 'i',
                },
            },
        ];
    }

    if (options.semester) {
        filters.semester = options.semester;
    }
    if (options.category) {
        filters.category = options.category;
    }
    if (options.course) {
        filters.course = options.course;
    }

    const totalResults = await Note.countDocuments(filters);

    if(!totalResults) throw new ApiError(400, "total results count not found")

    const notes = await Note.find(filters)
        .select(`title subject category uploader stats file createdAt`)
        .populate('uploader', `firstName lastName avatar verificationStatus`)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(options.limit)
        .lean();

    return {
        notes,
        pagination: {
            page: options.page,
            limit: options.limit,
            totalResults,
            totalPages: Math.ceil(totalResults / options.limit),
        },
    };
};
