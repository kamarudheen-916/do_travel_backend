import { IPostRepositry} from "../../useCase/interface/IPostRepository";
import PropertyModel from "../database/propertyModel";
import { propertyPostModel } from "../database/propertyPostModel";
import { PostModel } from "../database/PostModel";

class PostRepository implements IPostRepositry  {
    async addComment(comment: string, postId: string, userId: string,userType:string|undefined): Promise<any> {
        try {
            const updatedPost = await PostModel.findByIdAndUpdate(
                { _id: postId },
                {
                    $push: {
                        comments: {
                            comment: comment,
                            commentedId: userId, 
                        }
                    }
                },
                { new: true } // Option to return the updated document
            );
            return updatedPost;
           
        } catch (error) {
            console.log('addComment error in postRepository:', error);
            throw error; // Rethrow the error for handling in the upper layers
        }
    }
    
    async deleteComment(postId: string, commentId: string, index: number,userType:string|undefined) {
        try {
            const post = await PostModel.findById(postId)

            if (!post) {
                return { success: false, message: "Post not found" };
            }
            if (index < 0 || index >= post.comments.length) {
                return { success: false, message: "Invalid comment index" };
            }
            post.comments.splice(index, 1);
            await post.save();
            return { success: true, message: "Comment deleted successfully",post };
        } catch (error) {
            console.log('delete comment error:', error);
            return { success: false, message: "An error occurred while deleting the comment" };
        }
    }
    
    async  editComment(postId: string | undefined, commentId: string | undefined, editedComment: string,userType:string|undefined): Promise<any> {
        try {
           
                const post = await PostModel.findById(postId)
                if (!post) {
                    return { success: false, message: "Post not found" };
                }
                const commentIndex = post.comments.findIndex(comment => comment && comment._id && comment._id.toString() === commentId);
                post.comments[commentIndex].comment = editedComment
                await post.save()
                return {success:true, message:'Comment updated',post}
            
        } catch (error) {
            console.log('edit comment error:', error);
            return { success: false, message: "An error occurred while editing the comment" };
        }
    }
   
   async updateRating(postId:any, rating: any, userId:any): Promise<any> {
        try {
            const data = {
                raterId:userId,
                rate:rating,
                ratedDate:new Date()
            }
            const doc = await PostModel.findOne({_id:postId})
            console.log('////////////////\\\\\\\\\\',doc);

            if(doc){
                const isAlreadyRated =  doc.ratings.find((item) =>item.raterId === userId)
                if (isAlreadyRated) {
                    isAlreadyRated.rate = rating;
                } else {
                    doc.ratings.push(data);
                }
                await doc.save();
                return { success: true, message: 'Rating updated successfully' };
            }else{
                const res = await PostModel.updateOne({_id:postId},{$push:{
                    ratings:data
                }})
                if(res.modifiedCount > 0){
                    return {success:true,message:'rating successful..!'}
                }else{
                    return {success:false,message:'rating failed..!'}
                }
            }
          
        } catch (error) {
            console.log('update Rating error :',error);
            
        }
    }
    
}

export default PostRepository;
