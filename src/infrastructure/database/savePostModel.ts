import mongoose, { Schema } from "mongoose";
import { savePost } from "../../domain_entities/savePosts";


const savePostSchema:Schema<savePost> = new Schema({
    userId: {type:String},
    postIds :{type:[String]}
})

const savePostModel = mongoose.model<savePost>('SavePost',savePostSchema)
export default savePostModel