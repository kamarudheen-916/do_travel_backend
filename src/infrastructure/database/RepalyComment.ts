
import mongoose,{Schema} from "mongoose";
import { comments } from "../../domain_entities/Post";
const replayCommentSchema :Schema<comments> = new Schema({
    parantId:{type:String},
    comment:{type:String},
    commentedId:{type:String},
    comment_likes:{type:Number,default:0},
    commentTime:{type:Date,default : new Date()},
    replayComments:{type:[String],ref:'replayComment'},
    comenterName:{type:String},
    comenterProfile:{type:String},

})

const replayCommentModel = mongoose.model<comments>('replayComment',replayCommentSchema)
export  {replayCommentModel}