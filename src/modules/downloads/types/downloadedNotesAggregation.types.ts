import { INote } from "@/modules/notes/types/note.types";

import { IUser } from "@/modules/users/types/user.types";
import { IDownload } from "./download.types";

export type DownloadedNoteAggregation = IDownload & {
    note: INote;
    uploader: IUser;
};