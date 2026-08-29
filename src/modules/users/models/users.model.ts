import mongoose, { Schema } from 'mongoose';
import { VERIFICATION_ENUM } from '../constants/userVerification.constant';
import { IUser } from '../types/user.types';
import { ROLE_ENUM } from '../constants/userRole.constant';

const UserSchema = new Schema(
    {
        // Firebase Identity
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // Basic User Info
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        },

        firstName: {
            type: String,
            trim: true,
            default: '',
            required: true,
        },

        lastName: {
            type: String,
            trim: true,
            default: '',
        },

        userName: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },

        avatar: {
            url: {
                type: String,
                default: '',
                validate: {
                    validator: function (v: string) {
                        return v === '' || /^https?:\/\/.+/.test(v);
                    },
                    message: 'Invalid avatar URL',
                },
            },

            storagePath: {
                type: String,
                default: ''
            },
        },

        bio: {
            type: String,
            maxlength: 300,
            default: '',
        },

        college: {
            type: String,
            trim: true,
            default: '',
        },
        course: {
            type: String,
            trim: true,
            default: '',
        },
        subjects: {
            type: [String],
            default: [],
            validate: {
                validator: function (arr: string[]) {
                    return (
                        Array.isArray(arr) &&
                        arr.every((s) => typeof s === 'string' && s.length >= 1 && s.length <= 20)
                    );
                },
                message: 'Each subject must be a non-empty string (max 20 chars).',
            },
        },

        university: {
            type: String,
            trim: true,
            default: '',
        },

        semester: {
            type: Number,
            min: 1,
            max: 10,
            default: 1
        },

        roles: {
            type: [String],
            enum: ROLE_ENUM,
            default: 'student',
            required: true,
            validate: {
                validator: function (v: string[]) {
                    return Array.isArray(v) && v.length > 0;
                },
                message: 'A user must have at least one role.',
            },
        },
        verificationStatus: {
            type: String,
            enum: VERIFICATION_ENUM,
            default: 'not_verified',
            required: true,
        },

        // Preferences
        preferences: {
            language: {
                type: String,
                default: 'en',
            },

            theme: {
                type: String,
                enum: ['light', 'dark', 'system'],
                default: 'system',
            },

            notifications: {
                email: {
                    type: Boolean,
                    default: true,
                },

                push: {
                    type: Boolean,
                    default: true,
                },

                marketing: {
                    type: Boolean,
                    default: false,
                },
            },
        },

        // User Stats
        stats: {
            reputationScore: {
                type: Number,
                default: 0,
                min: 0,
            },

            notesUploadedCount: {
                type: Number,
                default: 0,
                min: 0,
            },

            totalDownloads: {
                type: Number,
                default: 0,
                min: 0,
            },

            totalViews: {
                type: Number,
                default: 0,
                min: 0,
            },
            followersCount: {
                type: Number,
                default: 0,
                min: 0,
            },
            followingCount: {
                type: Number,
                default: 0,
                min: 0,
            },
        },

        // Moderation
        moderation: {
            isBanned: {
                type: Boolean,
                default: false,
                index: true,
            },

            banReason: {
                type: String,
                default: '',
            },

            banUntil: {
                type: Date,
                default: null,
            },
        },

        // Activity
        lastLoginAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

//Virtual Fullname
UserSchema.virtual('fullName').get(function (this: IUser) {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

//Do this before saving the user to the db
UserSchema.pre('save', async function () {
    const doc = this as IUser & mongoose.Document;
    if (doc.moderation?.banUntil && doc.moderation.banUntil <= new Date()) {
        doc.moderation.isBanned = false;
        doc.moderation.banUntil = null;
    }
});

// Performance indexes
UserSchema.index({
    'stats.reputationScore': -1,
    'stats.notesUploadedCount': -1,
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
