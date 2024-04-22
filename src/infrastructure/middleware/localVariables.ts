import { Request,Response,NextFunction } from "express";
export function localVariables(req:Request,res:Response,next:NextFunction){
    req.app.locals={
        OTP:null,
        userType:null,
        email:null
    }
    next()
}