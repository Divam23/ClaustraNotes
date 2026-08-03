//THIS IS FOR THE USERS WHO REPORT A NOTE AND CAN SELECT FROM THE FOLLOWING REASONS
export const MODERATION_FLAGS_ENUM = ['spam', 'inappropriate', 'copyright', 'low_quality', 'repetitive', 'others'] as const;

export type NoteModerationFlagsType = (typeof MODERATION_FLAGS_ENUM)[number];
