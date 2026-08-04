import mongoose, { Schema } from 'mongoose';
import { IDownload } from '../types/download.types';

const DownloadSchema = new Schema<IDownload>(
    {
        user: {
            type: mongoose.Types.ObjectId,
            required: true,
        },

        note: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

DownloadSchema.index(
    {
        user: 1,
        note: 1,
    },
    { unique: true }
);

const Download = mongoose.model('Download', DownloadSchema);

export default Download;
