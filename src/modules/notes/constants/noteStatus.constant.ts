export const NOTE_PUBLISH_STATUS_ENUM = [
    'draft',
    'published', 
    'archived', 
    'removed'
] as const;

export type NoteStatusType = (typeof NOTE_PUBLISH_STATUS_ENUM)[number];

export const NOTE_VERIFICATION_STATUS_ENUM = [
    'unverified',
    'pending_review',
    'verified',
    'rejected',
] as const;

export type NoteVerificationStatusType = (typeof NOTE_VERIFICATION_STATUS_ENUM)[number];
