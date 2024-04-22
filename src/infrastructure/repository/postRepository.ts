import { IPostRepositry} from "../../useCase/interface/IPostRepository";
import { UserPostModel } from "../database/userPostModel";

class PostRepository implements IPostRepositry  {
    async addComment(comment: string, postId: string, userId: string): Promise<any> {
        try {
            const updatedPost = await UserPostModel.findByIdAndUpdate(
                { _id: postId },
                {
                    $push: {
                        comments: {
                            comment: comment,
                            id: userId, 
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
}

export default PostRepository;
