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
import ConversationModel from "../database/ConversationModel2";
import MessageModel from "../database/MessageModel2";
import { getReceiverSocketId, io } from "../utils/socketIo";

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
        }, 90000);
        
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


    async findPostByUserId(userId:string|undefined,userType:string|undefined){
      try {       
        
        const allPost = await PostModel.find({userId}).populate('comments')

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
      async sendMessage(message: string, senderId: string, receiverId: string): Promise<any> {
        try {
          let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
          });

          if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId]
            });
            }

                        const newMessage = new MessageModel({
                    senderId,
                    receiverId,
                    message
                    });

          if (newMessage) {
            conversation.messages.push(newMessage._id);
            }


            await Promise.all([conversation.save(), newMessage.save()]);

            const receiverSocketId = getReceiverSocketId(receiverId)
            if(receiverSocketId){
                // io.to(<socket_Id>).emit() is used to send events to specific clients
                io.to(receiverSocketId).emit('newMessage',newMessage)
            }
            return newMessage
        } catch (error) {
          console.log('send message error in user repository ');
          
        }
      }
      async getMessages(userToChatId: string, senderId: string): Promise<any> {
        try {
          if(senderId && userToChatId){
            console.log('chat id :',userToChatId);
            console.log('chat id :',senderId);
        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return []

        const messages = conversation.messages;
        console.log('rest as;l====>',messages);
        return messages
        }

        } catch (error) {
           console.log("Error in getMessages controller: ", error);
            return { error: "Internal server error" }
            
        }
      } 
      async getUsersForSidebar(loggedInUserId:string): Promise<any> {
        try {
         const  users = await UserModel.find({ _id: { $ne: loggedInUserId } })
        const  properties = await PropertyModel.find({_id:{$ne:loggedInUserId}})
        const filteredUsers = [...users,...properties] 
        return filteredUsers
        } catch (error) {
          console.error("Error in getUsersForSidebar: ", error);
            return { error: "Internal server error" }
            
        }
      } 
  
}

export default UserRepository 