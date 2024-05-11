 export interface comments {
    comment:string,
    commentedId:string,
    comment_likes:number,
    _id?:string,
    commentTime:Date

}
export interface ratingData{
    raterId:string,
    rate:number,
    _id?:string,
    ratedDate:Date, 
}

export interface UserPost {
    _id?:string,
    userId:string,
    isProperty:boolean,
    post:string,
    description:string,
    location:string,
    date:Date,
    like:Number,
    comments:comments[],
    ratings:[ratingData],
    PostProfile:string,
    PostName:string,
}

