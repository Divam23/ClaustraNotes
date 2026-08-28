import User from "@/modules/users/models/users.model";
import { GetDownloadedNotesOptions } from "../types/getAllDownloads.types";
import { ApiError } from "@/shared/utils/ApiError";
import { QueryFilter } from "mongoose";
import { IDownload } from "../types/download.types";
import { PipelineStage } from "mongoose";
import Download from "../model/download.model";

export const getAllDownloadedNotes = async({
    firebaseUid,
    options,
}: {
    firebaseUid: string;
    options: GetDownloadedNotesOptions
}) => {
    const user =  await User.findOne({firebaseUid}).lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const filters: QueryFilter<IDownload> = {
        user: user._id,
    }

    const skip = (options.page - 1) * options.limit;

    const pipeline: PipelineStage[] = [
        {
            $match: filters,
        },
        {
            $lookup:{
                from: 'notes',
                localField: 'note',
                foreignField: '_id',
                as: 'note'
            },

        },
        {
            $unwind: '$note'
        },
        {
            $lookup:{
                from: 'users',
                let: {uploaderId: '$note.uploader'},
                pipeline: [
                    {
                        $match:{
                            $expr:{
                                $eq: ['$_id', '$uploaderId'],
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
            $unwind: '$uploader'
        },
        {
            $match:{
                'note.isPublic': true,
                'note.notePublishStatus': 'published',
                'note.moderation?.isDeleted': false,
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
            downloads: [
                {
                    $sort:{
                        createdAt: -1
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: options.limit,
                }
            ],
            metadata: [
                {
                    $count: 'totalResults',
                },
            ],
        }
    });

    const result = await Download.aggregate(pipeline);
    const downloadedNotesData = result[0]?.downloads ?? [];
    const totalResults = result[0]?.metadata[0]?.totalResults ?? 0;

    return {
        downloads: downloadedNotesData,
        pagination: {
            totalResults,
            page: options.page,
            limit: options.limit,
            totalPages: Math.ceil(totalResults/options.limit)
        }
    }
};
