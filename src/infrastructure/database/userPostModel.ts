import mongoose,{Schema} from "mongoose";
import { UserPost, comments } from "../../domain_entities/userPost";

const commentSchema :Schema<comments> = new Schema({
    comment:{type:String},
    id:{type:String},
    comment_likes:{type:Number,default:0}
})

const UserPostSchema:Schema<UserPost>  = new Schema({
    // _id:{type:String},
    userId:{type:String},
    post:{type:String},
    description:{type:String},
    location:{type:String},
    date:{type:Date,default:Date.now},
    like:{type:Number,default:0},
    comments:{type:[commentSchema]},
    reate:{type:String},

})

const UserPostModel = mongoose.model<UserPost>('UserPost',UserPostSchema)
export  {UserPostModel}