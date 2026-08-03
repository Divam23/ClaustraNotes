export const NOTE_CATEGORY_ENUM = [
  'lecture_notes',
  'handwritten',
  'previous_year_questions',
  'revision_notes',
  'assignment',
  'lab_manual',
  'lab_record',
  'summary',
  'cheat_sheet',
  'presentation',
  'ebook',
  'syllabus',
  'question_bank',
  'practice_set',
  'project_report',
  'others'
] as const;

export type NoteCategoryType = (typeof NOTE_CATEGORY_ENUM)[number];
