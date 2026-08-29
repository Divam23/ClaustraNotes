import { Request, Response } from 'express';
import { ApiError } from '@/shared/utils/ApiError';
import { ApiResponse } from '@/shared/utils/ApiResponse';
import { asyncHandler } from '@/shared/utils/asyncHandler';
import { mapPersonalProfileResponse } from '../mappers/personalProfile.mapper';
import { mapPublicProfileResponse } from '../mappers/publicProfile.mapper';
import { mapUpdateProfileResponse } from '../mappers/updateProfile.mapper';
import { getPersonalProfile } from '../services/getPersonalProfile.service';
import { getPublicProfile } from '../services/getPublicProfile.service';
import { updateUserProfile } from '../services/updateUserProfile.service';
import { updateProfileAvatar } from '../services/updateAvatar.service';

export const getCurrentUserPersonalProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const user = await getPersonalProfile(req.user?.firebaseUid!);
  return res.status(200).json(new ApiResponse(200, mapPersonalProfileResponse(user)));
});

export const getCurrentUserPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  const user = await getPublicProfile(req.user?.firebaseUid!);
  return res.status(200).json(new ApiResponse(200, mapPublicProfileResponse(user)));
});

export const updateCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const updatedUserProfile = await updateUserProfile(req.user!.firebaseUid, req.body);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        mapUpdateProfileResponse(updatedUserProfile),
        'User details updated successfully'
      )
    );
});

export const updateUserProfileAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const updatedUserAvatar = await updateProfileAvatar(req.user!.firebaseUid, req.file);

  return res.status(200).json(new ApiResponse(200, updatedUserAvatar, "Avatar uploaded successfully!"))
});
