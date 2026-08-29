import * as authService from "./auth.service"
import { Request, Response } from "express";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { ApiResponse } from "@/shared/utils/ApiResponse";

export const authenticateUser = asyncHandler(async(req: Request, res:Response)=>{

    const user = await authService.findOrCreateUser(req.firebaseUser!)
    console.log(user);
    return res.status(200).json(new ApiResponse(200, user, "User authenticated Successfully"))
})

export const getCurrentUser = asyncHandler(async(req:Request, res:Response)=>{
    const user = await authService.getCurrentUser(req.firebaseUser!);
    return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"))
})