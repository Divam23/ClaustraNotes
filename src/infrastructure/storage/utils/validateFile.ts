import { ApiError } from '@/shared/utils/ApiError';
import { fileMimeMap } from './mimeMap';

//100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const validateFile = (mimeType: string, size: number) => {
  if (!fileMimeMap[mimeType as keyof typeof fileMimeMap]) {
    throw new ApiError(400, 'Invalid file type');
  }

  if (size > MAX_FILE_SIZE) {
    throw new ApiError(400, 'File size exceeds limit');
  }
};
