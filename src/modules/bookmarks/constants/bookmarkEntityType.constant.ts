export const BOOKMARK_ENTITY_TYPE_ENUM = ["Note"] as const

export type BookmarkEntityType = (typeof BOOKMARK_ENTITY_TYPE_ENUM)[number];