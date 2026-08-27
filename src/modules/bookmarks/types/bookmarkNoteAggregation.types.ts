import { INote } from "@/modules/notes/types/note.types";
import { IBookmark } from "./bookmark.types";
import { IUser } from "@/modules/users/types/user.types";

export type BookmarkNoteAggregation = IBookmark & {
    note: INote;
    uploader: IUser;
};