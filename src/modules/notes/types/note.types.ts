import mongoose, { Document } from 'mongoose';
import { NoteModerationFlagsType } from '../constants/noteModerationFlags.constant';
import { NoteCategoryType } from '../constants/noteCategory.constant';
import { NoteContentType } from '../constants/noteContentType.constant';
import { NoteStatusType, NoteVerificationStatusType } from '../constants/noteStatus.constant';
import { IUser } from '@/modules/users/types/user.types';

export interface IPopulatedNote extends Omit<INote, 'uploader'> {
    uploader: IUser;
}

export interface INote extends Document {
    title: string;
    description: string;
    subject: string;
    branch: string;
    category: NoteCategoryType;
    contentType: NoteContentType;
    tags?: string[];
    course?: string;
    university?: string;
    collegeName?:string;
    semester?: number;
    language: string;

    file: {
        storagePath:string;
        mimeType: string;
        size: number;
        thumbnailUrl: string;
        canDownload: boolean;
        pageCount: number;
        readingTime: number;
    };

    extractedText?: string;

    uploader: mongoose.Types.ObjectId;
    isPublic: boolean;
    notePublishStatus: NoteStatusType;
    publishedAt?: Date;
    submittedForReviewAt?: Date;
    approvedAt?:Date;
    rejectedAt?:Date;
    rejectionReason?:String;
    noteVerificationStatus:NoteVerificationStatusType;
    
    stats: {
        viewsCount: number;
        downloadCount: number;
        sharesCount: number;
        likesCount:number;
        commentsCount: number;
        bookmarksCount:number;
        ratingsAverage: number;
        ratingsCount: number;
        engagementScore: number;
        qualityScore: number;
        conversionRate: number;
        lastViewedAt: Date;
    };
    moderation: {
        isDeleted:boolean;
        deletedAt:Date;
        deletedBy:mongoose.Types.ObjectId;
        deletionReason:string;
        reportCount: number;
        moderationFlags: NoteModerationFlagsType[];
        moderatedBy: mongoose.Types.ObjectId;
        moderatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;

    calculateEngagementScore(): number;

    updateConversionRate(): void;
}
