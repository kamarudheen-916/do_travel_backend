 export interface comments {
    comment:string,
    id:string,
    comment_likes:number
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

