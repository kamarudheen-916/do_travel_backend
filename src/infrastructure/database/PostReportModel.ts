import mongoose, {Schema} from "mongoose"
import { PostReport } from "../../domain_entities/PostReport"


const PostReportSchema = new Schema<PostReport>({
    postId:{type:String},
    reporterId:{type:String},
    reporterType:{type:String},
    reason:{type:String},
    reportDate:{type:Date,default:Date.now()},
    status:{type:String},
    
})

const PostReportModel = mongoose.model<PostReport>('PostReportData',PostReportSchema)
export default PostReportModel