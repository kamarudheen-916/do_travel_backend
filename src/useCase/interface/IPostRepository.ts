import Property from "../../domain_entities/property"
import { searchData } from "../../domain_entities/searchData"

export interface IPostRepositry{
    addComment(comment:string,postId:string,userId:string|undefined,userType:string|undefined):Promise<any>
    deleteComment(postId:string,commentId:string,index:number,userType:string|undefined):Promise<any>
    editComment(postId:string|undefined,commentId:string|undefined,editedComment:string,userType:string|undefined):Promise<any>
    propertySearch (searchData:string,userId:string|undefined,userType:string|undefined):Promise<Property[]>

}