
export interface IPostRepositry{
    addComment(comment:string,postId:string,userId:string|undefined):Promise<any>
}