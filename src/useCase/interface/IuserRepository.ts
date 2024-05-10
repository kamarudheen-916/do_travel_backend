import Property from "../../domain_entities/property";
import { searchData } from "../../domain_entities/searchData";
import User from "../../domain_entities/user";
import { UserPost } from "../../domain_entities/userPost";

interface IuserRepository {
    findByEmail(email:string,userType:string):Promise<User|Property|null>
    saveUser(user:User|Property,userType:string):Promise<User|Property|null>
    insertUserPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}):Promise<any>
    insertPropertyPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}):Promise<any>
    findPostByUserId(userId:string|undefined,userType:string|undefined):Promise<any>
    findUserById(userId:string|undefined,userType:string|undefined):Promise<any>
    uploadUserProfile(profile:string,userId:string|undefined,userType:string|undefined):Promise<any>
    getUserData(userId:string|undefined,userType:string|undefined):Promise<any>
    updateUserData(userData:User|Property,userId:string|undefined,userType:string|undefined):Promise<any>
    userSearch (searchData:string,userId:string|undefined,userType:string|undefined):Promise<User[]>
    setThemeMode(mode:string|undefined,userId:string|undefined):Promise<any>
    getThemeMode(userId:string|undefined):Promise<any>
}

export default IuserRepository