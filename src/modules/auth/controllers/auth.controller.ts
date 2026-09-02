import {findOrCreateUser, getCurrentUser} from "@/modules/auth/services/auth.service"; 
import { Request, Response } from "express";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { ApiResponse } from "@/shared/utils/ApiResponse";
import { mappedAuthenticatedUser } from "../mappers/authUser.mapper";
import { ApiError } from "@/shared/utils/ApiError";

export const authenticateUserController = asyncHandler(async(req: Request, res:Response)=>{
    const user = await findOrCreateUser(req.firebaseUser!);
    if(!user){
        throw new ApiError(500, "Failed to create or retrieve user");
    }
    const mappedResponse = mappedAuthenticatedUser({user});
    return res.status(200).json(new ApiResponse(200, mappedResponse, "User authenticated Successfully"))
})

export const getCurrentUserController = asyncHandler(async(req:Request, res:Response)=>{
    const user = await getCurrentUser(req.firebaseUser!);
    if(!user){
        throw new ApiError(500, "Failed to create or retrieve user");
    }
    const mappedResponse = mappedAuthenticatedUser({user});
    return res.status(200).json(new ApiResponse(200, mappedResponse, "Current user fetched successfully"))
})