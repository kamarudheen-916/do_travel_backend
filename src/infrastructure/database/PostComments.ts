
import mongoose,{Schema} from "mongoose";
import { comments } from "../../domain_entities/Post";
const commentSchema :Schema<comments> = new Schema({
    parantId:{type:String},
    comment:{type:String},
    commentedId:{type:String},
    comment_likes:{type:Number,default:0},
    commentTime:{type:Date,default : new Date()},
    replayComments:{type:[String],ref:'replayComment'},
    comenterName:{type:String},
    comenterProfile:{type:String},

})

const commnetModel = mongoose.model<comments>('comments',commentSchema)
export  {commnetModel}