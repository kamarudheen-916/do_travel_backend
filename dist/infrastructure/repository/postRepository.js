"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const propertyModel_1 = __importDefault(require("../database/propertyModel"));
const PostModel_1 = require("../database/PostModel");
const savePostModel_1 = __importDefault(require("../database/savePostModel"));
const userModel_1 = require("../database/userModel");
const propertyRoom_1 = __importDefault(require("../database/propertyRoom"));
const PostReportModel_1 = __importDefault(require("../database/PostReportModel"));
const PostComments_1 = require("../database/PostComments");
const RepalyComment_1 = require("../database/RepalyComment");
class PostRepository {
    async addComment(comment, postId, userId, userType) {
        try {
            let user;
            if (userType === 'user') {
                user = await userModel_1.UserModel.findById(userId);
            }
            else {
                user = await propertyModel_1.default.findById(userId);
            }
            const data = {
                parantId: postId,
                comment: comment,
                commentedId: userId,
                comenterName: user.firstName || user.PropertyName,
                comenterProfile: user.Profile || user.PropertyProfile
            };
            const newComment = await PostComments_1.commnetModel.create(data);
            if (newComment) {
                const post = await PostModel_1.PostModel.findByIdAndUpdate({ _id: postId }, {
                    $push: { comments: newComment._id }
                }, { new: true }).populate('comments');
                console.log(post);
                return post;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log('addComment error in postRepository:', error);
            throw error; // Rethrow the error for handling in the upper layers
        }
    }
    async postReplayComment(postId, replayCommentId, replayComment, userId, userType) {
        try {
            let user;
            if (userType === 'user') {
                user = await userModel_1.UserModel.findById(userId);
            }
            else {
                user = await propertyModel_1.default.findById(userId);
            }
            const data = {
                parantId: replayCommentId,
                comment: replayComment,
                commentedId: userId,
                comenterName: user.firstName || user.PropertyName,
                comenterProfile: user.Profile || user.PropertyProfile
            };
            const newReplayComment = await RepalyComment_1.replayCommentModel.create(data);
            if (newReplayComment) {
                const comment = await PostComments_1.commnetModel.findByIdAndUpdate({ _id: replayCommentId }, {
                    $push: { replayComments: newReplayComment._id }
                }, { new: true }).populate('replayComments');
                console.log('comment*****> :', comment);
                if (comment) {
                    return comment;
                }
                else {
                    return;
                }
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log('postReplayComment error in postRepository:', error);
            throw error;
        }
    }
    async fetchReplayComment(commentId) {
        try {
            const comment = await PostComments_1.commnetModel.findById(commentId).populate('replayComments');
            if (comment) {
                console.log('comment :', comment);
                return comment;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log('fetchReplayComment error in postRepository:', error);
            throw error;
        }
    }
    async deleteComment(postId, commentId, index, userType) {
        try {
            const comment = await PostComments_1.commnetModel.deleteOne({ _id: commentId });
            if (!comment) {
                return { success: false, message: "comment not found" };
            }
            const post = await PostModel_1.PostModel.findById(postId).populate('comments');
            return { success: true, message: "Comment deleted successfully", post };
        }
        catch (error) {
            console.log('delete comment error:', error);
            return { success: false, message: "An error occurred while deleting the comment" };
        }
    }
    async editComment(postId, commentId, editedComment, userType) {
        try {
            const comment = await PostComments_1.commnetModel.findById(commentId);
            if (!comment) {
                return { success: false, message: "Post not found" };
            }
            comment.comment = editedComment;
            await comment.save();
            const post = await PostModel_1.PostModel.findById(postId).populate('comments');
            return { success: true, message: 'Comment updated', post };
        }
        catch (error) {
            console.log('edit comment error:', error);
            return { success: false, message: "An error occurred while editing the comment" };
        }
    }
    async updateRating(roomId, rating, userId, ratingCommnent) {
        try {
            console.log('comment :', ratingCommnent);
            const data = {
                raterId: userId,
                rate: rating,
                ratedDate: new Date(),
                comments: ratingCommnent !== '' ? ratingCommnent : ''
            };
            const doc = await propertyRoom_1.default.findOne({ _id: roomId });
            if (doc) {
                const isAlreadyRated = doc.ratings.find((item) => item.raterId === userId);
                if (isAlreadyRated) {
                    isAlreadyRated.rate = rating;
                    isAlreadyRated.ratedDate = new Date();
                    isAlreadyRated.comments = ratingCommnent;
                }
                else {
                    doc.ratings.push(data);
                }
                await doc.save();
                return { success: true, message: 'Rating updated successfully' };
            }
            else {
                const res = await propertyRoom_1.default.updateOne({ _id: roomId }, { $push: {
                        ratings: data
                    } });
                if (res.modifiedCount > 0) {
                    return { success: true, message: 'rating successful..!' };
                }
                else {
                    return { success: false, message: 'rating failed..!' };
                }
            }
        }
        catch (error) {
            console.log('update Rating error :', error);
        }
    }
    async saveOrUnSavePost(postId, save_or_unsave, userId) {
        try {
            if (save_or_unsave == 'save') {
                const res = await savePostModel_1.default.updateOne({ userId }, { $push: { postIds: postId } }, { upsert: true });
                console.log('save post response :', res);
                if (res.modifiedCount > 0 || res.upsertedCount > 0) {
                    return { success: true, message: 'Your post is saved..!' };
                }
                else {
                    return { success: false, message: 'Oops..! There is an issue when saving the post.' };
                }
            }
            else if (save_or_unsave == 'unsave') {
                const doc = await savePostModel_1.default.findOne({ userId });
                if (doc) {
                    const index = doc.postIds.findIndex((item) => item === postId);
                    if (index) {
                        doc.postIds.splice(index, 1);
                        await doc.save();
                        return { success: true, message: 'Your post is removed..!' };
                    }
                    else {
                        return { success: false, message: 'Oops..! There is no such post.' };
                    }
                }
            }
            else {
                return { success: false, message: 'cannot get the data from front end ... for developer' };
            }
        }
        catch (error) {
            console.log('save or unsave post error in post repository :', error);
        }
    }
    async isPostSaved(postId, userId) {
        try {
            const doc = await savePostModel_1.default.findOne({ userId });
            if (doc) {
                const isSaved = doc.postIds.includes(postId);
                if (isSaved) {
                    return { success: true, message: 'This post is saved' };
                }
                else {
                    return { success: false, message: 'cannot find the post' };
                }
            }
            return { success: false, message: 'cannot find the post' };
        }
        catch (error) {
            console.log('is post saved error in post repositiory:', error);
        }
    }
    async likeOrUnLikePost(postId, Like_or_unLike, userId) {
        try {
            if (Like_or_unLike === 'like') {
                const doc = await PostModel_1.PostModel.updateOne({ _id: postId }, { $push: { like: userId } });
                if (doc.modifiedCount > 0) {
                    const post = await PostModel_1.PostModel.findById(postId).populate('comments');
                    return { success: true, message: 'Liked succesfully..!', post };
                }
                else {
                    return { success: false, message: 'There is an issue to like this post...!' };
                }
            }
            else if (Like_or_unLike === 'unlike') {
                const doc = await PostModel_1.PostModel.findById(postId);
                if (doc) {
                    const index = doc.like.findIndex(item => item === userId);
                    if (index !== -1) {
                        doc.like.splice(index, 1);
                        await doc.save();
                        const post = await PostModel_1.PostModel.findById(postId).populate('comments');
                        return { success: true, message: 'unLiked succesfully..!', post };
                    }
                    else {
                        return { success: false, message: 'There is an issue to like this post...**!' };
                    }
                }
            }
            else {
                return { success: false, message: 'There is an issue to like this post...!' };
            }
        }
        catch (error) {
            console.log('likeOrUnLikePost error in post repositiory:', error);
            return { success: false, message: 'There is an issue to like this post...!' };
        }
    }
    async isPostLiked(postId, userId) {
        try {
            const doc = await PostModel_1.PostModel.findById(postId);
            if (doc) {
                if (doc.like.includes(userId)) {
                    return { success: true, message: 'This post is liked my this userId' };
                }
                else {
                    return { success: false, message: 'cannot find the userId' };
                }
            }
            else {
                return { success: false, message: 'cannot find the document' };
            }
        }
        catch (error) {
            console.log('is post liked error in post repository :', error);
            return { success: false, message: 'is post repository error ' };
        }
    }
    async fetchPostLikersData(postId) {
        try {
            console.log('fectch post likers data :', postId);
            const post = await PostModel_1.PostModel.findById(postId);
            if (post) {
                const likersData = await Promise.all(post.like.map(async (item) => {
                    const userData = await userModel_1.UserModel.findById(item);
                    const propertyData = await propertyModel_1.default.findById(item);
                    if (userData) {
                        return {
                            Profile: userData.Profile,
                            Name: userData.firstName,
                            isProperty: false,
                            id: userData._id
                        };
                    }
                    else if (propertyData) {
                        return {
                            Profile: propertyData.PropertyName,
                            Name: propertyData.PropertyName,
                            isProperty: true,
                            id: propertyData._id
                        };
                    }
                }));
                return { success: true, message: 'successfully fetched likers data ', likersData };
            }
            else {
                return { success: false, message: 'cannot find post by post id ' };
            }
        }
        catch (error) {
            console.log('fetchPostLikersData error in post repository :', error);
            return { success: false, message: 'cannot fetch likers data ' };
        }
    }
    async deletePost(postId, userId) {
        try {
            const res = await PostModel_1.PostModel.deleteOne({ _id: postId });
            console.log(res);
            if (res.deletedCount > 0) {
                const posts = await PostModel_1.PostModel.find({ userId });
                return { success: true, message: 'Successfully post deleted ', posts };
            }
            else {
                return { success: false, message: ' Post deletion failed ' };
            }
        }
        catch (error) {
            console.log('deletePost error in post repository :', error);
            return { success: false, message: 'cannot delete the post ' };
        }
    }
    async reportPost(data) {
        try {
            const res = await PostReportModel_1.default.insertMany([data]);
            return res;
        }
        catch (error) {
            console.log('report post error : ', error);
        }
    }
}
exports.default = PostRepository;
