import User from '../domain_entities/user'
import Property from '../domain_entities/property';
import IuserRepository from './interface/IuserRepository'
import { IPostRepositry } from './interface/IPostRepository';
import IHashPassword from './interface/IhashPassword';
import IJwtTocken from './interface/IjwtToken';
import GenerateOTP from '../infrastructure/utils/otpGenerate';
import ICloudinary from './interface/ICloudinary';
import SendMail from '../infrastructure/utils/sendMail';
import { UserModel } from '../infrastructure/database/userModel';
import PropertyModel from '../infrastructure/database/propertyModel';
import { UserPostModel } from '../infrastructure/database/userPostModel';


class UserUseCase{    
    constructor(
        private readonly iUserRepository : IuserRepository,
        private readonly IpostRepository : IPostRepositry,
        private readonly hashPass : IHashPassword,
        private readonly jwt : IJwtTocken,
        private readonly cloudinary : ICloudinary,
        private readonly generateOTP:GenerateOTP,
        private readonly sendMail : SendMail
    ){}

    async userSignUp (userData:User,userType:string){
        try {    
            const email = userData.email
            const isUser = await this.iUserRepository.findByEmail(email,userType)
            if(isUser){
                return {success : false,message:'This Email is already exists'}
            }else{  
                const password = userData.password
                const hashedPassword = await this.hashPass.createHash(password)
                userData.password = hashedPassword
                const imageUrl = userData.Profile !== ''?
                 await this.cloudinary.saveToCloudinary(userData?.Profile) : ''
                userData.Profile = imageUrl
                const OTP =  await this.generateOTP.generateOTP()
                userData.OTP = OTP.toString()
                this.sendMail.sendMail(userData.firstName,email,OTP)
                const userSave = await this.iUserRepository.saveUser(userData,userType)
                if(userSave){
                    return  {success:true,message:'Signup successful..!',Data:userSave}
                  }else{
                    return  {success:false,message:'Something error'}
                  }
            }
        } catch (error) {
            console.log('user singup error in UserUseCase :',error);
            
        }
    }

    async PropertySignUP(propertyData:Property,userType:string){
        try {
            const isProperty = await this.iUserRepository.findByEmail(propertyData.email,userType)
            if(isProperty){
                return {success:false,message:'This Email is already exist..!'}
            }else{
                const hashedPassword =await this.hashPass.createHash(propertyData.password)
                const licenseUrl =await this.cloudinary.saveToCloudinary(propertyData.license)
                const profileUrl =await this.cloudinary.saveToCloudinary(propertyData.PropertyProfile)
                propertyData.password = hashedPassword
                propertyData.license = licenseUrl
                propertyData.PropertyProfile = profileUrl
                const OTP =  await this.generateOTP.generateOTP()
                propertyData.OTP = OTP.toString()
                this.sendMail.sendMail(propertyData.PropertyName,propertyData.email,OTP)
                const propetySave = await this.iUserRepository.saveUser(propertyData,userType)
                if(!propetySave){
                    return  {success:false,message:'Something error'}
                  }else{
                    return  {success:true,message:'User successfully signed up',Data:propetySave}
                  }
            }
        } catch (error) {
            console.log('Propety SingUP error in UserUsecase : ',error);
            
        }
    }
    
    async verifyOTP(OTP:string,userId:any,userType:string){
        try {
            const user = userType === 'user'?
            await UserModel.findById(userId):
            await PropertyModel.findById(userId)
            console.log('OTP:',OTP,'--','real OTP :',user?.OTP,'userType:',userType);
            
             if(OTP == user?.OTP ){
                const result = userType === 'user' ? 
                await UserModel.updateOne({_id:userId},{$set:{
                    IsVerified:true
                }}): 
                await PropertyModel.updateOne({_id:userId},{$set:{
                    IsVerified:true
                }})
                console.log('result:============',result);
                
               return {success:true,message:'Signup successful..!'}
             }else{
                return {success:false,message:'OTP is not verified..!'}
             }
                     
                   
                 
        } catch (error) {
            console.log('verifyOTP error in UserUseCase ',error);
            
        }
    }

    async userLogin({email,password,userType}:{email:string,password:string,userType:string}){
        try {
            const isUser = await this.iUserRepository.findByEmail(email,userType)
            if(!isUser){
                return {success:false,message:'This Email does not exist..!'}
            }else{
                const isPassMatch =await this.hashPass.compare(password,isUser.password)
                if(!isPassMatch){
                    return {success:false,message:'Invalid Password..!'}
                }else if(isUser.isBlocked){
                    return {success:false,message:'User is Blocked By Admin..!'}
                }else{
                    const JWT_KEY = process.env.JWT_KEY
                    if(JWT_KEY){   
                        const token = this.jwt.createJWT(isUser._id as string,'user')
                        return {success:true,message:'Successfully logged in',token,user:isUser}
                    }
                }
            }
        } catch (error) {
            console.log('login error in useCase : ',error);
            
        }
    }
    
    async forgottenPassword (email:string,newPassword:string,confPass:string,userType:string){
        try {
            if(newPassword === confPass){
                const RealOTP = await this.generateOTP.generateOTP()
                const model =  userType === 'user' ? UserModel :PropertyModel
                await model.updateOne({email},{$set:{OTP:RealOTP}})
                this.sendMail.sendMail(email,email,RealOTP)
                setTimeout(async () => {
                    console.log('settimeout ===========');
                    
                    const result = userType === 'user' ? 
                    await UserModel.updateOne({email:email},{
                      $set:{
                        OTP:'****'
                      }}): 
                    await PropertyModel.updateOne({email:email},{
                      $set:{
                        OTP:'****'
                      }})
                  }, 30000);
                const hashedPassword = await this.hashPass.createHash(newPassword)
                return {success:true,email,hashedPassword,userType,RealOTP}
            }else{
                return {success:false,message:'Mismatch Password..!'}
            }
        } catch (error) {
            console.log('forgotten password error :',error);
            
        }
    }
    async verifyForgottenOTP (data:{OTP: string,email: string,hashedPassword:string,RealOTP: number,userId: string,userType: string,isForgotten: boolean}){
        const User = data.userType === 'user' ?
        await UserModel.findOne({email:data.email}):
        await PropertyModel.findOne({email:data.email})
        const RealOTP = User?.OTP
        if(data.OTP == RealOTP){
                const Model = data.userType === 'user' ? UserModel:PropertyModel
                await Model.updateOne({email:data.email},{$set:{password:data.hashedPassword}})
                return {success:true,message:'Password successfully changed..'}
        }else{
            return {success:false,message:'Invalid OTP..!'}
        }

    }
    async ResendOTP (userType:string,email:string){
        try {
            const RealOTP = await this.generateOTP.generateOTP()
                 const result = userType === 'user' ? 
                    await UserModel.updateOne({email:email},{
                      $set:{
                        OTP:RealOTP
                      }}): 
                    await PropertyModel.updateOne({email:email},{
                      $set:{
                        OTP:RealOTP
                      }})
                this.sendMail.sendMail(email,email,RealOTP)

                setTimeout(async () => {
                    console.log('settimeout ===========');
                    
                    const result = userType === 'user' ? 
                    await UserModel.updateOne({email:email},{
                      $set:{
                        OTP:'****'
                      }}): 
                    await PropertyModel.updateOne({email:email},{
                      $set:{
                        OTP:'****'
                      }})
                  }, 30000);
            return RealOTP
        } catch (error) {
            console.log('ResenOTP erro in useUseCase',error);
            
        }
    }

    async userCreate (postData:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}){
     try {
        console.log('post data :', postData);
        
        if(postData.userId && postData.userType){
          if(postData.userType === 'user'){
            const fileUrl = postData.fileUrl !== ''?
            await this.cloudinary.saveToCloudinary(postData?.fileUrl) : ''
            postData.fileUrl = fileUrl
           const  Response = await this.iUserRepository.insertUserPost(postData)
                if(Response){
                    console.log('Response:',Response);
                    
                    return {success:true,message:'Post successful..'}
                }else{
                    return {success:false,message:'Oops..! something went wrong..'}
                }
          }
        }else{
            throw new Error('undefined userId or user type : in userUserCase : in userCreate')
        }
     } catch (error) {
        console.log('userCreate Error in user use case :',error);
        
     }
    }
    async getAllPost(userId:any){
        try {
            const allPost = await this.iUserRepository.findPostByUserId(userId)
            if(allPost){
                return {success:true,message:'fetch data success',allPost}
            }else{
                return {success:false,message:'fetch data failed'}
            }
        } catch (error) {
            console.log('getAllPost error in userUseCase ',error);
        }
    }
    async postComment({comment,postId}:{comment:string,postId:string},userId:string|undefined){
        try {
            const res = await this.IpostRepository.addComment(comment,postId,userId)
            if(res){
                return {success:true,message:'Comment posted.',res}
            }else{
                return {sucess:false,message:'oops..! Cannot post you comment..!'}
            }
        } catch (error) {
            console.log('postComment error in userUseCase ',error);
            
        }
    }
   
}

export default UserUseCase