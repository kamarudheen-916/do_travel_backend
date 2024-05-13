import { IPostRepositry} from "../../useCase/interface/IPostRepository";
import PropertyModel from "../database/propertyModel";
import { propertyPostModel } from "../database/propertyPostModel";
import { PostModel } from "../database/PostModel";
import savePostModel from "../database/savePostModel";
import { UserModel } from "../database/userModel";

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
    async saveOrUnSavePost(postId: string, save_or_unsave: string, userId: string | undefined): Promise<any> {
        try {
            
            if(save_or_unsave == 'save'){
             const res = await savePostModel.updateOne({userId},{$push:{postIds:postId}},{upsert:true})
             console.log('save post response :',res);
             
             if(res.modifiedCount>0 || res.upsertedCount> 0){
                return {success:true,message:'Your post is saved..!'}
             }else{
                return {success:false,message:'Oops..! There is an issue when saving the post.'}
             }
            }else if(save_or_unsave == 'unsave'){
                const doc = await savePostModel.findOne({userId})
                if(doc){
                  const index =   doc.postIds.findIndex((item)=>item === postId)
                  if(index){
                    doc.postIds.splice(index,1)
                    await doc.save()
                    return {success:true,message:'Your post is removed..!'}

                  }else{
                    return {success:false,message:'Oops..! There is no such post.'}
                  }
                }
            }else{
                return {success:false,message:'cannot get the data from front end ... for developer'}
            }
        } catch (error) {
            console.log('save or unsave post error in post repository :',error);
            
        }
    }
    async  isPostSaved(postId: any, userId: string | undefined): Promise<any> {
        try {
            const doc = await savePostModel.findOne({userId})
            if(doc){
                const isSaved  = doc.postIds.includes(postId)
                if(isSaved){
                    return {success:true,message:'This post is saved'}
                }else{
                    return {success:false,message:'cannot find the post'}
                }
            }
            return {success:false,message:'cannot find the post'}
        } catch (error) {
            console.log('is post saved error in post repositiory:',error);
            
        }
    }
    async likeOrUnLikePost(postId: string, Like_or_unLike: string, userId: string | undefined): Promise<any> {
        try {
            if(Like_or_unLike === 'like'){
                const doc = await PostModel.updateOne({_id:postId},{$push:{like:userId}})
                if(doc.modifiedCount >0){
                     return {success:true,message:'Liked succesfully..!'}

                }else{
                      return {success:false,message:'There is an issue to like this post...!'}
                    }

            }else if(Like_or_unLike === 'unlike'){
                const doc = await PostModel.findById(postId)                
                if(doc){
                    const index = doc.like.findIndex(item => item === userId)
                    if(index !== -1){
                        doc.like.splice(index,1)
                        await doc.save()
                        return {success:true,message:'unLiked succesfully..!'}

                    }else{
                        return {success:false,message:'There is an issue to like this post...**!'}
                    }
                }
            }else{
                return {success:false,message:'There is an issue to like this post...!'}
            }
        } catch (error) {
            console.log('likeOrUnLikePost error in post repositiory:',error);
            return {success:false,message:'There is an issue to like this post...!'}

        }
    }
     async isPostLiked(postId: any, userId: any): Promise<any> {
        try {
            const doc = await PostModel.findById(postId)
            if(doc){
                if(doc.like.includes(userId)){
                    return {success:true,message:'This post is liked my this userId'}
                }else{
                    return {success:false,message:'cannot find the userId'}
                }
            }else{
                return {success:false,message:'cannot find the document'}
            }
        } catch (error) {
            console.log('is post liked error in post repository :',error);
            return {success:false,message:'is post repository error '}
        }
    }
    async fetchPostLikersData(postId: any): Promise<any> {
        try {
            console.log('fectch post likers data :',postId);
            
            const post = await PostModel.findById(postId)
            if(post){
                const likersData = await Promise.all(post.like.map(async (item)=>{
                    const userData = await  UserModel.findById(item)
                    const propertyData = await PropertyModel.findById(item)
                    if(userData){
                        return  {
                            Profile:userData.Profile,
                            Name : userData.firstName,
                            isProperty:false,
                            id:userData._id
                        }
                    }else if(propertyData){
                        return  {
                            Profile:propertyData.PropertyName,
                            Name : propertyData.PropertyName,
                            isProperty:true,
                            id:propertyData._id
                        }
                    }
                }))
            return {success:true,message:'successfully fetched likers data ',likersData}
                
            }else{
            return {success:false,message:'cannot find post by post id '}
            }
        } catch (error) {
            console.log('fetchPostLikersData error in post repository :',error);
            return {success:false,message:'cannot fetch likers data '}
            
        }
    }

    async deletePost(postId: any,userId:any): Promise<any> {
        try {
            const res = await PostModel.deleteOne({_id:postId})
            console.log(res);
            
            if(res.deletedCount>0){
                const posts = await PostModel.find({userId})
               return {success:true,message:'Successfully post deleted ',posts}
            }else{
                return {success:false,message:' Post deletion failed '}
            }
        } catch (error) {
            console.log('deletePost error in post repository :',error);
            return {success:false,message:'cannot delete the post '}
        }
    }
}

export default PostRepository;
