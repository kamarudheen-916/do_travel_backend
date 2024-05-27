import { PostReport } from "../../domain_entities/PostReport"
import Property from "../../domain_entities/property"
import { searchData } from "../../domain_entities/searchData"

export interface IPostRepositry{
    addComment(comment:string,postId:string,userId:string|undefined,userType:string|undefined):Promise<any>
    postReplayComment(postId:string,replayCommentId:string,replayComment:string,userId:string,userType:string):Promise<any>
    fetchReplayComment(commentId:string):Promise<any>
    deleteComment(postId:string,commentId:string,index:number,userType:string|undefined):Promise<any>
    editComment(postId:string|undefined,commentId:string|undefined,editedComment:string,userType:string|undefined):Promise<any>
    updateRating(postId:string|undefined,rating:number|undefined,userId:string|undefined,ratingComment:string):Promise<any>
    saveOrUnSavePost(postId:string,save_or_unsave:string,userId:string|undefined) : Promise<any>
    isPostSaved(postId:any,userId:string|undefined):Promise<any>
    likeOrUnLikePost(postId:string,Like_or_unLike:string,userId:string|undefined) : Promise<any>
    isPostLiked(postId:any,userId:string|undefined):Promise<any>
    fetchPostLikersData(postId:any):Promise<any>
    deletePost(postId:any,userId:any):Promise<any>
    reportPost(data:PostReport):Promise<any>


    
}