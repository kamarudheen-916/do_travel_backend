import User from "../../domain_entities/user";
import Property from "../../domain_entities/property";
import IuserRepository from "../../useCase/interface/IuserRepository";
import { UserModel } from "../database/userModel";
import PropertyModel from "../database/propertyModel";

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

        console.log('user',user);
        
        const result = userType === 'user' ? 
        await UserModel.create(user): 
        await PropertyModel.create(user)
        
        setTimeout(async () => {
          console.log('settimeout ===========');
          
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

}

export default UserRepository 