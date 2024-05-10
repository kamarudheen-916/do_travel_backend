import { IPostRepositry} from "../../useCase/interface/IPostRepository";
import PropertyModel from "../database/propertyModel";
import { propertyPostModel } from "../database/propertyPostModel";
import { UserPostModel } from "../database/userPostModel";

class PostRepository implements IPostRepositry  {
    async addComment(comment: string, postId: string, userId: string,userType:string|undefined): Promise<any> {
        try {

           if(userType === 'user' ){
            const updatedPost = await UserPostModel.findByIdAndUpdate(
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
           }else if(userType === 'property'){
            const updatedPost = await propertyPostModel.findByIdAndUpdate(
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
           }
        } catch (error) {
            console.log('addComment error in postRepository:', error);
            throw error; // Rethrow the error for handling in the upper layers
        }
    }
    
    async deleteComment(postId: string, commentId: string, index: number,userType:string|undefined) {
        try {
            let post = userType === 'user' ?
            await UserPostModel.findById(postId):
            await propertyPostModel.findById(postId);

            if (!post) {
                return { success: false, message: "Post not found" };
            }
    
            // Check if the index is within the valid range
            if (index < 0 || index >= post.comments.length) {
                return { success: false, message: "Invalid comment index" };
            }
    
            // Delete the comment
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
            if(userType === 'property'){
                const post = await propertyPostModel.findById(postId)
                if (!post) {
                    return { success: false, message: "Post not found" };
                }
                const commentIndex = post.comments.findIndex(comment => comment && comment._id && comment._id.toString() === commentId);
                post.comments[commentIndex].comment = editedComment
                await post.save()
                return {success:true, message:'Comment updated',post}
            }else {
                const post = await UserPostModel.findById(postId)
                if (!post) {
                    return { success: false, message: "Post not found" };
                }
                const commentIndex = post.comments.findIndex(comment => comment && comment._id && comment._id.toString() === commentId);
                post.comments[commentIndex].comment = editedComment
                await post.save()
                return {success:true, message:'Comment updated',post}
            }
        } catch (error) {
            console.log('edit comment error:', error);
            return { success: false, message: "An error occurred while editing the comment" };
        }
    }
    async propertySearch(searchData: string, userId: string | undefined, userType: string | undefined): Promise<any> {
        try {
          const searchRegex = new RegExp(searchData, 'i');
          const users = await PropertyModel.find({ PropertyName: { $regex: searchRegex } } );
          return users;
      } catch (error) {
          console.log('User search error:', error);
          throw error;
      }
      }
    
}

export default PostRepository;
