import mongoose,{Schema} from "mongoose";
import { UserPost, comments, ratingData } from "../../domain_entities/Post";

const commentSchema :Schema<comments> = new Schema({
    comment:{type:String},
    commentedId:{type:String},
    comment_likes:{type:Number,default:0},
    commentTime:{type:Date,default : new Date()}
})


const ratingSchema :Schema<ratingData> = new Schema({
    raterId:{type:String},
    rate:{type:Number},
    ratedDate:{type:Date,default : new Date()}
})

const propertyPostSchema:Schema<UserPost>  = new Schema({
    userId:{type:String},
    post:{type:String},
    description:{type:String},
    location:{type:String},
    date:{type:Date,default:Date.now},
    like:{type:[String]},
    comments:{type:[String],ref:'comments'},
    ratings:{type:[ratingSchema]},

})

const propertyPostModel = mongoose.model<UserPost>('propertyPost',propertyPostSchema)
export  {propertyPostModel}