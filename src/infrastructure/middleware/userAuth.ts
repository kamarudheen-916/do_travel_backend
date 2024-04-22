import { Request,Response,NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import JwtTocken from "../utils/jwt";
import dotenv from 'dotenv';
import UserRepository from "../repository/userRepository";
import { decode } from "punycode";

const jwt = new JwtTocken()
const repository = new UserRepository()
dotenv.config()

declare global {
    namespace Express{
        interface Request{
            userId?:string
        }
    }
}

const UserAuth = async (req:Request,res:Response,next:NextFunction)=>{
    try {
     
        
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized - No token provided"})
        }  
        const decodedToken = jwt.verifyJWT(token)
        if(decodedToken && decodedToken.role !=='user'){
            return res.status(401).send({success:false,message:'Unauthorized - Invalid Token'})
        }
        
        if(decodedToken && decodedToken.id){
            let user:any = await repository.findUserById(decodedToken?.id)
            if(user?.isBlocked){
                return res.status(401).send({success:false,message:'User is blocked !!'})
            }else{
                req.userId = decodedToken?.id
                next()
            }
        }else{
            return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
    }
}

export default UserAuth