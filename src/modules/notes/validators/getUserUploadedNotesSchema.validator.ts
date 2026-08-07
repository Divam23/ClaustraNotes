import z from "zod";
import { NOTE_CATEGORY_ENUM } from "../constants/noteCategory.constant";
import { NOTE_CONTENT_TYPE_ENUM } from "../constants/noteContentType.constant";

export const getUserUploadedNotesSchema = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(50).default(15),
        subject: z.string().min(1).max(400).optional(),
        semester: z.coerce.number().optional(),
        category: z.enum(NOTE_CATEGORY_ENUM).optional(),
        course: z.string().optional(),
        contentType: z.enum(NOTE_CONTENT_TYPE_ENUM).optional(),
    }),
});