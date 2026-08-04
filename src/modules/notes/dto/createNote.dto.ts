import { NoteCategoryType } from "../constants/noteCategory.constant";


export interface CreateNoteDto{
    title: string,
    description?:string,
    subject: string,
    category: NoteCategoryType,
    tags?:string[],
    course: string,
    university?:string,
    semester:number,
    language?:string,
    isPublic:boolean,
    canDownload:boolean
}