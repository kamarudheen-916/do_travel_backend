import { IPostRepositry} from "../../useCase/interface/IPostRepository";
import PropertyModel from "../database/propertyModel";
import { propertyPostModel } from "../database/propertyPostModel";
import { PostModel } from "../database/PostModel";
import savePostModel from "../database/savePostModel";
import { UserModel } from "../database/userModel";
import RoomModel from "../database/propertyRoom";
import { PostReport } from "../../domain_entities/PostReport";
import PostReportModel from "../database/PostReportModel";
import { commnetModel } from "../database/PostComments";
import { replayCommentModel } from "../database/RepalyComment";

class PostRepository implements IPostRepositry  {
    async addComment(comment: string, postId: string, userId: string,userType:string|undefined): Promise<any> {
        try {
            let user:any
          if(userType === 'user'){
            user = await UserModel.findById(userId)
          }else{
            user = await PropertyModel.findById(userId)
          }
          const data :any ={
                parantId:postId,
                comment:comment,
                commentedId:userId,
                comenterName:user.firstName||user.PropertyName,
                comenterProfile:user.Profile||user.PropertyProfile
            }
            const newComment = await commnetModel.create(data);
            if(newComment){
                const post = await PostModel.findByIdAndUpdate({_id:postId},{
                    $push:{comments:newComment._id}
                },{new:true}).populate('comments')
                console.log(post);
                
                return post;
            }else {
                return null
            }

        } catch (error) {
            console.log('addComment error in postRepository:', error);
            throw error; // Rethrow the error for handling in the upper layers
        }
    }

    async postReplayComment(postId: string, replayCommentId: string, replayComment: string, userId: string, userType: string): Promise<any> {
        try {
            let user:any
            if(userType === 'user'){
              user = await UserModel.findById(userId)
            }else{
              user = await PropertyModel.findById(userId)
            }
            const data ={
                parantId:replayCommentId,
                comment:replayComment,
                commentedId:userId,
                comenterName:user.firstName||user.PropertyName,
                comenterProfile:user.Profile||user.PropertyProfile
            }
            const newReplayComment = await replayCommentModel.create(data)

            if(newReplayComment){
                const comment = await commnetModel.findByIdAndUpdate({_id:replayCommentId},{
                    $push:{replayComments:newReplayComment._id}
                },{new:true}).populate('replayComments')
                console.log('comment*****> :',comment);
                
                if(comment) {
                    return comment;
                }else{
                    return 
                }

            }else {
                return null
            }
        } catch (error) {
            console.log('postReplayComment error in postRepository:', error);
            throw error;
        }
    }
   async fetchReplayComment(commentId: string): Promise<any> {
        try {
            const comment = await commnetModel.findById(commentId).populate('replayComments')
            if(comment)
            {
                console.log('comment :',comment);
                
                return comment
            }else{
                return null
            }
        } catch (error) {
            console.log('fetchReplayComment error in postRepository:', error);
            throw error;
        }
    }
    async deleteComment(postId: string, commentId: string, index: number,userType:string|undefined) {
        try {
            const comment = await commnetModel.deleteOne({_id:commentId})

            if (!comment) {
                return { success: false, message: "comment not found" };
            }
            const post = await PostModel.findById(postId)
            return { success: true, message: "Comment deleted successfully",post };
        } catch (error) {
            console.log('delete comment error:', error);
            return { success: false, message: "An error occurred while deleting the comment" };
        }
    }
    
    async  editComment(postId: string | undefined, commentId: string | undefined, editedComment: string,userType:string|undefined): Promise<any> {
        try {
           
                const comment = await commnetModel.findById(commentId)
                if (!comment) {
                    return { success: false, message: "Post not found" };
                }
              
                comment.comment = editedComment
                await comment.save()
                const post = await PostModel.findById(postId)

                return {success:true, message:'Comment updated',post}
            
        } catch (error) {
            console.log('edit comment error:', error);
            return { success: false, message: "An error occurred while editing the comment" };
        }
    }
   
   async updateRating(roomId:any, rating: any, userId:any,ratingCommnent:string): Promise<any> {
        try {
            console.log('comment :',ratingCommnent);
            
            const data = {
                raterId:userId,
                rate:rating,
                ratedDate:new Date(),
                comments:ratingCommnent !== '' ? ratingCommnent : ''
            }
            const doc = await RoomModel.findOne({_id:roomId})
            

            if(doc){
                const isAlreadyRated =  doc.ratings.find((item) =>item.raterId === userId)
                if (isAlreadyRated) {
                    isAlreadyRated.rate = rating;
                    isAlreadyRated.ratedDate =new Date();
                    isAlreadyRated.comments = ratingCommnent

                } else {
                    doc.ratings.push(data);
                }
                await doc.save();
                return { success: true, message: 'Rating updated successfully' };
            }else{
                const res = await RoomModel.updateOne({_id:roomId},{$push:{
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
                    const post = await PostModel.findById(postId).populate('comments')
                     return {success:true,message:'Liked succesfully..!',post}

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
                          const post = await PostModel.findById(postId).populate('comments')

                        return {success:true,message:'unLiked succesfully..!',post}

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
    async  reportPost(data: PostReport): Promise<any> {
        try {
            const res = await PostReportModel.insertMany([data])
            return res
        } catch (error) {
            console.log('report post error : ',error);
            
        }
    }
}

export default PostRepository;
