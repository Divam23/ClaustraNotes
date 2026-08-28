
import Note from '../notes.model';
import { GetNoteListOptions } from '../types/getNoteListOptions.types';
import { INote } from '../types/note.types';
import {QueryFilter} from "mongoose";



export const getNoteList = async (options: GetNoteListOptions) => {
    const filters: QueryFilter<INote> = {
        isPublic: true,
        notePublishStatus: 'published',
        isDeleted: false,
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
    if (options.subject) {
        filters.subject = options.subject;
    }
    if(options.noteContentType){
        filters.contentType = options.noteContentType;
    }

    const totalResults = await Note.countDocuments(filters);

    const notes = await Note.find(filters)
        .select(`title subject category uploader stats file createdAt `)
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
