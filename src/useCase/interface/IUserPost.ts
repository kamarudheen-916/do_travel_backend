import { UserPost } from "../../domain_entities/userPost"

interface IUserPost {
    insertPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}):Promise<UserPost>
}