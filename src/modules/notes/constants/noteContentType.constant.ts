export const NOTE_CONTENT_TYPE_ENUM = ['pdf', 'docx', 'doc', 'pptx', 'ppt'] as const;

export type NoteContentType = (typeof NOTE_CONTENT_TYPE_ENUM)[number];
