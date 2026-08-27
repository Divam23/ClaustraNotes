import User from '@/modules/users/models/users.model';
import { ApiError } from '@/shared/utils/ApiError';
import { GetBookmarkOptions } from '../types/getAllBookmarkOptions.types';
import { QueryFilter, PipelineStage } from 'mongoose';

import { IBookmark } from '../types/bookmark.types';
import Bookmark from '../model/bookmark.model';

export const getAllBookmarks = async ({
    firebaseUid,
    options,
}: {
    firebaseUid: string;
    options: GetBookmarkOptions;
}) => {
    const user = await User.findOne({ firebaseUid }).lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const filters: QueryFilter<IBookmark> = {
        user: user._id,
        targetType: 'Note',

    };

    const skip = (options.page - 1) * options.limit;

    const pipeline: PipelineStage[] = [
        {
            $match: filters,
        },
        {
            $lookup: {
                from: 'notes',
                localField: 'targetId',
                foreignField: '_id',
                as: 'note',
            },
        },

        {
            $unwind: '$note',
        },
        {
            $lookup:{
                from: 'users',
                let: { uploaderId: '$note.uploader' },
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $eq: ['$_id', '$$uploaderId'],
                            }
                        }
                    },
                    {
                        $project:{
                            _id: 1,
                             firstName: 1,
                            lastName: 1,
                            avatar: 1,
                            verificationStatus: 1
                        }
                    }
                ],
                as: 'uploader'
            }
        },
        {
            $unwind: 'uploader'
        },
        {
            $match:{
                'note.isPublic': true,
                'note.notePublishStatus': 'published'
            }
        }
    ];

    if (options.query) {
        pipeline.push({
            $match: {
                $or: [
                    {
                        'note.title': {
                            $regex: options.query,
                            $options: 'i',
                        },
                    },
                    {
                        'note.description': {
                            $regex: options.query,
                            $options: 'i',
                        },
                    },
                    {
                        'note.subject': {
                            $regex: options.query,
                            $options: 'i',
                        },
                    },
                    {
                        'note.tags': {
                            $regex: options.query,
                            $options: 'i',
                        },
                    },
                ],
            },
        });
    }

    pipeline.push({
        $facet: {
            bookmarks: [
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: options.limit,
                },
            ],
            metadata: [
                {
                    $count: 'totalResults',
                },
            ],
        },
    });


    const result = await Bookmark.aggregate(pipeline);

    const bookmarksData = result[0]?.bookmarks ?? [];
    const totalResults = result[0]?.metadata[0]?.totalResults ?? 0;


    return {
        bookmarks: bookmarksData,
        pagination:{
            totalResults,
            page: options.page,
            limit: options.limit,
            totalPages: Math.ceil(totalResults / options.limit)
        }
        
    };
};
