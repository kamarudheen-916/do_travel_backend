import { Request,Response } from "express";
import UserUseCase from "../useCase/UserUseCase";
 
class UserController {
    constructor ( private readonly userCase : UserUseCase ){}

    async signUpUser(req :Request, res:Response){
        try {
            let {FormData,userType} = req.body
            const Response = await this.userCase.userSignUp(FormData,userType) 
            res.json(Response)             
        } catch (error) {
            console.log('signup error : ',error);
        }
    }

    async verifyOTP(req:Request,res:Response){
        try {
            const userId = req.params.userId
            const OTPData = req.body
            const verifyOtp = await this.userCase.verifyOTP(OTPData.OTP,OTPData.userId,OTPData.userType)
            res.json(verifyOtp) 
        } catch (error) {
            console.log('verifyOTP error in userController');
            
        }
    }

    async signUpProperty(req :Request, res:Response){
        try { 
            let {FormData,userType} = req.body
            const property = await this.userCase.PropertySignUP(FormData,userType)
             res.json(property)
        } catch (error) {
            console.log('signup error : ',error);
            
        }
    }

    async loginUser(req:Request,res:Response){
        try {
            const {formData,userType} =  req.body
            const {email,password} = formData
            const  user = await this.userCase.userLogin({email,password,userType})
            return res.json(user)
        } catch (error) {
            console.log('loginPost error ',error);
            
        }
    }
    async forgottenPass(req:Request,res:Response){
        try {
            const {forgetFormData,userType} = req.body
            const {email,password,confirmPassword} = forgetFormData
            const newPass =await this.userCase.forgottenPassword(email,password,confirmPassword,userType)
            return res.json(newPass)
            
        } catch (error) {
            console.log('forgotten password error :',error);
            
        }
    }
    async verifyForgottenOTP(req:Request,res:Response){
        try {
            const data = req.body
            const IsVerified =await this.userCase.verifyForgottenOTP(data)
            console.log('IsVerified',IsVerified);
            return res.json(IsVerified)
        } catch (error) {
            console.log('verifyForgottenOTP error :',error);
            
        }
    }
    async resendOTP(req:Request,res:Response){
        try {
            const { userType, email } = req.params; 
            if(userType === undefined){
                res.json ({success:false,message:'Please try again..!'})
            }else{
                const isRsendOTP = await this.userCase.ResendOTP(userType,email)
                if(isRsendOTP){
                    res.json( {success:true,message:'Resend OTP successful'})
                }else{
                    res.json({sucess:false,message:'Resend OTP failed..!'})
                }
            }
            
        } catch (error) {
            console.log('resend otp error in userController',error);
            
        }
    }

    async userCreate (req:Request,res:Response){
        try {
            const PostData = req.body
            const Response = await this.userCase.userCreate(PostData)
            console.log(Response);
            
            res.json(Response)
        } catch (error) {
            console.log('userCreate error in user Controller',error);
            
        }
    }

    async getAllPost(req:Request,res:Response){
        try {

            const userId = req.userId
            const Response = await this.userCase.getAllPost(userId)
            console.log('==========================',Response); 
            res.json(Response)            
        } catch (error) {
            console.log('getAllPost error in userController :',error);
        }
    }

    async postComment(req:Request,res:Response){
        try {
            const Response = await this.userCase.postComment(req.body,req.userId)
            res.json(Response)
        } catch (error) {
            console.log('postComment error in userController :',error);
            
        }
    }
}



export default UserController