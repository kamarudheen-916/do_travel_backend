import User from "../../domain_entities/user";
import Property from "../../domain_entities/property";
import IuserRepository from "../../useCase/interface/IuserRepository";
import { UserModel } from "../database/userModel";
import PropertyModel from "../database/propertyModel";
import { PostModel } from "../database/PostModel";
import { propertyPostModel } from "../database/propertyPostModel";
import mongoose from "mongoose";
import { searchData } from "../../domain_entities/searchData";
import ThemeModel from "../database/themeModel";
import { profile } from "console";

class UserRepository implements IuserRepository{
     async findByEmail(email: string,userType:string) {
        try {
            const userExist = userType === 'user' ? await UserModel.findOne({email:email}): await PropertyModel.findOne({email:email})
    
            return userExist ? userExist : null
        } catch (error) {
            console.log('find by email error :' ,error);
            return null
        }
    }
    async saveUser(user: User|Property,userType:string) {
      try {  
        const result = userType === 'user' ? 
        await UserModel.create(user): 
        await PropertyModel.create(user)
        
        setTimeout(async () => {
          const result = userType === 'user' ? 
          await UserModel.updateOne({email:user.email},{
            $set:{
              OTP:'****'
            }}): 
          await PropertyModel.updateOne({email:user.email},{
            $set:{
              OTP:'****'
            }})
        }, 30000);
        
        return result
      } catch (error) {
        console.log('save user error in userRepository:',error);
        return null
        
      }
    }
    async insertPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null,userName:any,Profile:any}){
      try {
          const post = data.fileUrl
          const description = data.textarea
          const userId = data.userId
          const isProperty = data.userType === 'property' ? true : false 
          const PostProfile = data.Profile
          const PostName = data.userName
          const Response = await PostModel.insertMany({post,description,userId,isProperty,PostProfile,PostName})
          return Response
      } catch (error) {
          console.log('isertUserPost error in repository');
          return null
          
      }
    }
    // async insertPropertyPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}){
    //   try {
    //     const post = data.fileUrl
    //     const description = data.textarea
    //     const userId = data.userId
    //     const Response = await propertyPostModel.insertMany({post,description,userId})
    //     return Response
    //   } catch (error) {
    //     console.log('insertPropertyPost error in userRepository',error);
    //     return null
    //   }
    // }

    async findPostByUserId(userId:string|undefined,userType:string|undefined){
      try {       
        const allPost = await PostModel.find({userId})
        return allPost
      } catch (error) {
        console.log('findPostByUserIdError in user Repositoty:',error);
      }
    }

    async findUserById(userId:string,userType:string){
      try {
          let user
          if(userType === 'user'){
             user = await UserModel.findOne({_id:userId})
          }else{
            user = await PropertyModel.findOne({_id:userId})
          }
          return user
      } catch (error) {
        console.log('findUserById error in user Repository :',error);
        
      }
    }
  async uploadUserProfile(profile: string, userId: string | undefined,userType:string|undefined): Promise<any> {
      try {
        if(userType === 'user')
             return await UserModel.updateOne({_id:userId},{$set:{Profile:profile}})
        else if(userType === 'property')
             return await PropertyModel.updateOne({_id:userId},{$set:{PropertyProfile:profile}})
        else return {success:false,message:'unautharised user'}
      } catch (error) {
        console.log('findUserById error in user Repository :',error);
      }
  }
  async getUserData(userId: string | undefined, userType: string | undefined): Promise<any> {
      try {
        let user
        if(userType == 'user'){
            user = await UserModel.findOne({_id:userId})
        }
        else{
            user = await PropertyModel.findOne({_id:userId})
        }
        if(user){
          return {success : true,message:'user data',user}
        }else{
          return {success : false,message:'cannot fetch user data'}
        }
      } catch (error) {
        console.log('get user data error in user repository',error);
        return {success : false,message:'cannot fetch user data',error}
        
      }
  }
  async updateUserData(userData: User | Property, userId: string | undefined, userType: string | undefined): Promise<any> {
    try {
      if (!userType || !userId) {
        throw new Error('userType or userId is undefined');
      }
    
      let Res;
      if (userType === 'user') {
        Res =await UserModel.findByIdAndUpdate(userId, userData, { new: true });
      } else {
        Res =await PropertyModel.findByIdAndUpdate(userId, userData, { new: true });
      }
  
      if (!Res ) {
        throw new Error('No documents were modified');
      }
   
      return {success:true,message:'Profile successfully updated'}; 
    } catch (error) {
      console.log('update user Data error:', error);
      throw error; 
    }
  }
  async userSearch(searchData: string, userId: string | undefined, userType: string | undefined): Promise<any> {
    try {
      const searchRegex = new RegExp(searchData, 'i');
      const users = await UserModel.find({ firstName: { $regex: searchRegex } });
      return users;
  } catch (error) {
      console.log('User search error:', error);
      throw error;
  }
  }
  async setThemeMode(mode: string | undefined,userId:string|undefined): Promise<any> {
    try {
        const res = await ThemeModel.updateOne({userId},{$set:{ThemeMode:mode}},{upsert:true})
        if(res){
          return {success:true,message:'successfully mode changed'}
        }else{
          return {success:false,message:'failed mode changed'}
        }
        
    } catch (error) {
      console.log('set Theme mode error in user reopository');
      
    }
  }
  async getThemeMode(userId:string|undefined): Promise<any> {
    try {
        const res = await ThemeModel.findOne({userId})
       if(res){
        return res.ThemeMode
       }else{
        return 'normalMode'
       }
        
    } catch (error) {
      console.log('set Theme mode error in user reopository');
      
    }
  }
   async propertySearch(searchData: string, userId: string | undefined, userType: string | undefined): Promise<any> {
        try {
          const searchRegex = new RegExp(searchData, 'i');
          const users = await PropertyModel.find({ PropertyName: { $regex: searchRegex } } );
          return users;
      } catch (error) {
          console.log('User search error:', error);
          throw error;
      }
      }
}

export default UserRepository 