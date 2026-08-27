import z from "zod";

export const getAllBookmarkSchema = z.object({
    query: z.object({
        query: z.string().min(1).max(300).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10)
    })
})