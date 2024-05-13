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
            res.json(Response)
        } catch (error) {
            console.log('userCreate error in user Controller',error);
        }
    }
    async getAllPosts(req:Request,res:Response){
        try {
            const userId = req.userId
            const userType = req.userType
            const Response = await this.userCase.getAllPosts(userId,userType)
            res.json(Response)            
        } catch (error) {
            console.log('getAllPost error in userController :',error);
        }
    }

    async getAllFeeds(req:Request,res:Response){
        try {
            const userId = req.userId
            const userType = req.userType
            const Response = await this.userCase.getAllFeeds(userId,userType)
            res.json(Response)            
        } catch (error) {
            console.log('getAllPost error in userController :',error);
        }
    }
    

    async getOthersProfile(req: Request, res: Response) {
        try {
            
            const { profileId, profileType } = req.query;
            const userID = typeof profileId === 'string' ? profileId: undefined;
            if (userID === undefined) {
                throw new Error('userId is undefined or not a string');
            }
            const userType = typeof profileType === 'string' ? profileType: undefined;
            if (userID === undefined) {
                throw new Error('userType is undefined or not a string');
            }
            const getPosts = await this.userCase.getAllPosts(userID, profileType);    
            const userData = await this.userCase.getUserData(userID,userType)
            res.json({getPosts,userData});
        } catch (error) {
            console.log('getOthersProfile error in userController:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    

    async getUserData(req:Request,res:Response){
        try {
            const userId = req.userId
            const userType = req.userType
            const Res = await this.userCase.getUserData(userId,userType)
             res.json(Res)
        } catch (error) {
            console.log('get user data for edit user detail in profile error :',error);
            
        }
    }
    async updateUserData(req:Request,res:Response){
        try {
            const userId = req.userId
            const userType = req.userType
            const userData = req.body
          
            const Res = await this.userCase.updateUserData(userData,userId,userType)
             res.json(Res)
        } catch (error) {
            console.log('get user data for edit user detail in profile error :',error);
            
        }
    }
    async postComment(req:Request,res:Response){
        try {
            console.log(req.body);
            const Response = await this.userCase.postComment(req.body,req.userId,req.userType)
            res.json(Response)
        } catch (error) {
            console.log('postComment error in userController :',error);
            
        }
    }
    async deleteComment(req:Request,res:Response){
        try {
             const postData = req.body
             postData.userType = req.userType
             const Response = await this.userCase.deleteComment(postData)
             return res.json(Response)
        } catch (error) {
            console.log('delete comment error in userController :',error);
            
        }
    }
    async editComment(req:Request,res:Response){
        try {
            const editData = req.body
            console.log(editData);
            
            const userType = req.userType
             const Response = await this.userCase.editComment(editData,userType)
           
             return res.json(Response)
        } catch (error) {
            console.log('edit comment error in userController :',error);
        }
    }
    async updateRating(req:Request,res:Response){
        try {
            const RatingData = req.body
            console.log('RatingData:',RatingData);
            const userId = req.userId
             const Response = await this.userCase.updateRating(RatingData,userId)
           
             return res.json(Response)
        } catch (error) {
            console.log('edit comment error in userController :',error);
        }
    }
    async saveOrUnSavePost(req:Request,res:Response){
        try {
            const {postId,isSave} =  req.body
            const userId = req.userId
            const save_or_unsave = isSave ? 'unsave' :'save'
            console.log('save or unsave :',save_or_unsave);
            
             const Response = await this.userCase.saveOrUnSavePost(postId,save_or_unsave,userId)
           
             return res.json(Response)
        } catch (error) {
            console.log('saveOrUnSavePost error in userController :',error);
        }
    }
    async likeOrUnLikePost(req:Request,res:Response){
        try {            
            const {postId,isLiked} =  req.body
            const userId = req.userId
            const Like_or_unLike = isLiked ? 'unlike' :'like'
            console.log('like or unlike :',Like_or_unLike);
             const Response = await this.userCase.likeOrUnLikePost(postId,Like_or_unLike,userId)
             return res.json(Response)
        } catch (error) {
            console.log('likeOrUnLikePost error in userController :',error);
        }
    }
    async isPostSaved(req:Request,res:Response){
        try {
            const userId = req.userId
            const {postId} = req.query
            const Response = await this.userCase.isPostSaved(postId,userId)
            res.json(Response)
        } catch (error) {
            console.log('isPostSaved error in userController :',error);
        }
    }
    async isPostLiked(req:Request,res:Response){
        try {
            const userId = req.userId
            const {postId} = req.query
            const Response = await this.userCase.isPostLiked(postId,userId)
            res.json(Response)
        } catch (error) {
            console.log('isPostLiked error in userController :',error);
        }
    }
    async fetchPostLikersData(req:Request,res:Response){
        try {
            const {postId} = req.query
            const Response = await this.userCase.fetchPostLikersData(postId)
            res.json(Response)
        } catch (error) {
            console.log('isPostLiked error in userController :',error);
        }
    }
    async deletePost(req:Request,res:Response){
        try {
            const userId = req.userId
            const {postId} = req.query
            const Response = await this.userCase.deletePost(postId,userId)
            res.json(Response)
        } catch (error) {
            console.log('deletePost error in userController :',error);
        }
    }
    async uploadImg (req:Request,res:Response){
        try {
            const userProfile = req.body.fileURL
            const userId = req.userId
            const userType = req.userType
            const resp = await this.userCase.uploadUserProfile(userProfile,userId,userType)          
            return res.json(resp)
        } catch (error) {
            console.log('uploadImg error in userController :',error);
            
        }
    }

    async userSearch (req:Request,res:Response){
        try {
            const searchData = req.query.searchData;            
            const userId = req.userId
            const userType = req.userType
            const resp = await this.userCase.userSearch(searchData,userId,userType)          
            return res.json(resp)
        } catch (error) {
            console.log('uploadImg error in userController :',error);
            
        }
    }


    async setThemeMode (req:Request,res:Response){
        try {
            const mode = req.body.mode
            const userId = req.userId
            const resp = await this.userCase.setThemeMode(mode,userId)          
            return res.json(resp)
        } catch (error) {
            console.log('uploadImg error in userController :',error);
            
        }
    }
    async getThemeMode (req:Request,res:Response){
        try {
            const userId = req.userId
            const resp = await this.userCase.getThemeMode(userId)          
            return res.json(resp)
        } catch (error) {
            console.log('uploadImg error in userController :',error);
            
        }
    }
}





export default UserController