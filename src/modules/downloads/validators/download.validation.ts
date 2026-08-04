import { objectIdValidationSchema } from "@/shared/validators/objectIdValidation.validator";
import {z} from "zod";

export const downloadSingleNoteSchema = z.object({
    params: z.object({
        noteId: objectIdValidationSchema
    })
});