import { admin } from "@/firebase/admin";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";


const verifyFirebaseToken = asyncHandler (async(req:Request, res:Response, next:NextFunction)=>{
    const authHeaders = req.headers.authorization;
    if(!authHeaders || !authHeaders.startsWith("Bearer ")){
        throw new ApiError(401, "Invalid Token");
    }
    const token = authHeaders?.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.firebaseUser=decodedToken;
    next();

})

export {verifyFirebaseToken}