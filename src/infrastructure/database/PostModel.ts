import mongoose,{Schema} from "mongoose";
import { UserPost, ratingData } from "../../domain_entities/Post";



const ratingSchema :Schema<ratingData> = new Schema({
    raterId:{type:String},
    rate:{type:Number},
    ratedDate:{type:Date,default : new Date()}
})

const PostSchema:Schema<UserPost>  = new Schema({
    userId:{type:String},
    post:{type:String},
    description:{type:String},
    location:{type:String},
    date:{type:Date,default:Date.now},
    like:{type:[String]},
    comments:{type:[String],ref:'comments'},
    ratings:{type:[ratingSchema]},
    isProperty:{type:Boolean},
    PostProfile:{type:String},
    PostName:{type:String},

})

const PostModel = mongoose.model<UserPost>('Post',PostSchema)
export  {PostModel}