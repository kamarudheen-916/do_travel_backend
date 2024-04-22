import Property from "../../domain_entities/property";
import User from "../../domain_entities/user";
import { UserPost } from "../../domain_entities/userPost";

interface IuserRepository {
    findByEmail(email:string,userType:string):Promise<User|Property|null>
    saveUser(user:User|Property,userType:string):Promise<User|Property|null>
    insertUserPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}):Promise<any>
    findPostByUserId(userId:any):Promise<any>
    findUserById(userId:string):Promise<any>
}

export default IuserRepository