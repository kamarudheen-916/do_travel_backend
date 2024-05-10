 export interface comments {
    comment:string,
    commentedId:string,
    comment_likes:number,
    _id?:string,
    commentTime:Date

}
export interface UserPost {
    _id?:string,
    userId:string,
    post:string,
    description:string,
    location:string,
    date:Date,
    like:Number,
    comments:comments[],
    reate:string,
}

