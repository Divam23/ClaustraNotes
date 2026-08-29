import { Document } from 'mongoose';
import { VerificationType } from '../constants/userVerification.constant';
import { RoleType } from '../constants/userRole.constant';

export interface IUser extends Document {
    firebaseUid: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: {
        url: string;
        storagePath: string;
    };
    bio: string;
    college: string;
    course: string;
    subjects: string[];
    university: string;
    semester: number;
    verificationStatus: VerificationType;
    roles: RoleType[];
    preferences: {
        language: string;
        theme: 'light' | 'dark' | 'system';
        notifications: {
            email: boolean;
            push: boolean;
            marketing: boolean;
        };
    };
    stats: {
        reputationScore: number;
        notesUploadedCount: number;
        totalViews: number;
        totalDownloads:number;
        followersCount: number;
        followingCount: number;
    };
    moderation: {
        isBanned: boolean;
        banReason: string;
        banUntil: Date | null;
    };
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
