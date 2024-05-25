import { NextFunction, Request, Response } from "express";
import JwtTocken from "../utils/jwt";
import dotenv from 'dotenv';
const jwt = new JwtTocken()
dotenv.config()
declare global {
    namespace Express{
        interface Request{
            userId?:string
            userType?:string
        }
    }
}
const adminAuth = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if(!token){
                return res.status(401).json({success:false,message:'Unauthorized - No token provided'})
            }
            const decodedToken = jwt.verifyJWT(token)
            if((decodedToken) && (decodedToken.role !== 'admin')){
                return res.status(401).send({ success: false, message: 'Unauthorized - Invalid Token' });
            }
            if(decodedToken && decodedToken.id){
                req.userId = decodedToken?.id
                req.userType = decodedToken?.role
            console.log('chech admin auth');
                
                next()
            }else{
                return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
            }

        } catch (error) {
            console.log(error);
            return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
            
        }
}

export default adminAuth