import { NoteCategoryType } from "../constants/noteCategory.constant";
import { NoteContentType } from "../constants/noteContentType.constant";

export type GetNoteListOptions = {
    query?: string,
    page: number,
    limit: number,
    subject?: string,
    semester?: number;
    category?: NoteCategoryType;
    course?: string;
    noteContentType?: NoteContentType;
}