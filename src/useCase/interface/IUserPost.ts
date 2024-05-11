import { UserPost } from "../../domain_entities/Post"

interface IUserPost {
    insertPost(data:{fileUrl:string,textarea:string,userId:string|null,userType:string|null}):Promise<UserPost>
}