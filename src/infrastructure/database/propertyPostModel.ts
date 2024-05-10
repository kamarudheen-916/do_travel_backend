import mongoose,{Schema} from "mongoose";
import { UserPost, comments } from "../../domain_entities/userPost";

const commentSchema :Schema<comments> = new Schema({
    comment:{type:String},
    commentedId:{type:String},
    comment_likes:{type:Number,default:0},
    commentTime:{type:Date,default : new Date()}
})

const propertyPostSchema:Schema<UserPost>  = new Schema({
    userId:{type:String},
    post:{type:String},
    description:{type:String},
    location:{type:String},
    date:{type:Date,default:Date.now},
    like:{type:Number,default:0},
    comments:{type:[commentSchema]},
    reate:{type:String},

})

const propertyPostModel = mongoose.model<UserPost>('propertyPost',propertyPostSchema)
export  {propertyPostModel}