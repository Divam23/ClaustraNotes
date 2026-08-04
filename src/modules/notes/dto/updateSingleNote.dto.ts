import { NoteCategoryType } from "../constants/noteCategory.constant";

export interface UpdateSingleNoteDto{
    title?:string;
    description?:string;
    subject?:string,
    branch?:string,
    category?:NoteCategoryType,
    tags?:string[],
    course?:string,
    collegeName?:string,
    university?:string,
    semester?:number,
    language?:string,
    canDownload?:boolean;
    isPublic?:boolean,
} 