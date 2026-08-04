import mongoose, { Document} from "mongoose";

export interface IDownload extends Document{
    user: mongoose.Types.ObjectId;
    note: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}