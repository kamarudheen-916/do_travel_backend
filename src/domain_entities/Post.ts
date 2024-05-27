 export interface comments {
    parantId:string,
    comment:string,
    commentedId:string,
    comment_likes:number,
    _id?:string,
    commentTime:Date,
    replayComments:[string]
    comenterName:string;
    comenterProfile:string;

}
export interface ratingData{
    raterId:string,
    rate:number,
    _id?:string,
    ratedDate:Date, 
    comments:string,
}



export interface UserPost {
    _id?:string,
    userId:string,
    isProperty:boolean,
    post:string,
    description:string,
    location:string,
    date:Date,
    like:[string],
    comments:[string],
    ratings:[ratingData],
    PostProfile:string,
    PostName:string,
    // postStatus:string,
}

