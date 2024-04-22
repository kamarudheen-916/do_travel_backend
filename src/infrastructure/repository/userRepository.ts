import User from "../../domain_entities/user";
import Property from "../../domain_entities/property";
import IuserRepository from "../../useCase/interface/IuserRepository";
import { UserModel } from "../database/userModel";
import PropertyModel from "../database/propertyModel";
import { UserPostModel } from "../database/userPostModel";

class UserRepository implements IuserRepository{
     async findByEmail(email: string,userType:string) {
        try {
            const userExist = userType === 'user' ? await UserModel.findOne({email:email}): await PropertyModel.findOne({email:email})
            console.log('userExist :',userExist);
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
    async insertUserPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}){
      try {
          const post = data.fileUrl
          const description = data.textarea
          const userId = data.userId
          const Response = await UserPostModel.insertMany({post,description,userId})
          return Response
      } catch (error) {
          console.log('isertUserPost error in repository');
          return null
          
      }
    }

    async findPostByUserId(userId:any){
      try {       
       
        const allPost = await UserPostModel.find({userId})
        return allPost
      } catch (error) {
        console.log('findPostByUserIdError in user Repositoty:',error);
      }
    }

    async findUserById(userId:string){
      try {
          const user = await UserModel.findOne({_id:userId})
          return user
      } catch (error) {
        console.log('findUserById error in user Repository :',error);
        
      }
    }

}

export default UserRepository 