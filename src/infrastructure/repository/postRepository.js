"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    addComment(comment, postId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (userType === 'user') {
                    user = yield userModel_1.UserModel.findById(userId);
                }
                else {
                    user = yield propertyModel_1.default.findById(userId);
                }
                const data = {
                    parantId: postId,
                    comment: comment,
                    commentedId: userId,
                    comenterName: user.firstName || user.PropertyName,
                    comenterProfile: user.Profile || user.PropertyProfile
                };
                const newComment = yield PostComments_1.commnetModel.create(data);
                if (newComment) {
                    const post = yield PostModel_1.PostModel.findByIdAndUpdate({ _id: postId }, {
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
        });
    }
    postReplayComment(postId, replayCommentId, replayComment, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (userType === 'user') {
                    user = yield userModel_1.UserModel.findById(userId);
                }
                else {
                    user = yield propertyModel_1.default.findById(userId);
                }
                const data = {
                    parantId: replayCommentId,
                    comment: replayComment,
                    commentedId: userId,
                    comenterName: user.firstName || user.PropertyName,
                    comenterProfile: user.Profile || user.PropertyProfile
                };
                const newReplayComment = yield RepalyComment_1.replayCommentModel.create(data);
                if (newReplayComment) {
                    const comment = yield PostComments_1.commnetModel.findByIdAndUpdate({ _id: replayCommentId }, {
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
        });
    }
    fetchReplayComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield PostComments_1.commnetModel.findById(commentId).populate('replayComments');
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
        });
    }
    deleteComment(postId, commentId, index, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield PostComments_1.commnetModel.deleteOne({ _id: commentId });
                if (!comment) {
                    return { success: false, message: "comment not found" };
                }
                const post = yield PostModel_1.PostModel.findById(postId).populate('comments');
                return { success: true, message: "Comment deleted successfully", post };
            }
            catch (error) {
                console.log('delete comment error:', error);
                return { success: false, message: "An error occurred while deleting the comment" };
            }
        });
    }
    editComment(postId, commentId, editedComment, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield PostComments_1.commnetModel.findById(commentId);
                if (!comment) {
                    return { success: false, message: "Post not found" };
                }
                comment.comment = editedComment;
                yield comment.save();
                const post = yield PostModel_1.PostModel.findById(postId).populate('comments');
                return { success: true, message: 'Comment updated', post };
            }
            catch (error) {
                console.log('edit comment error:', error);
                return { success: false, message: "An error occurred while editing the comment" };
            }
        });
    }
    updateRating(roomId, rating, userId, ratingCommnent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('comment :', ratingCommnent);
                const data = {
                    raterId: userId,
                    rate: rating,
                    ratedDate: new Date(),
                    comments: ratingCommnent !== '' ? ratingCommnent : ''
                };
                const doc = yield propertyRoom_1.default.findOne({ _id: roomId });
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
                    yield doc.save();
                    return { success: true, message: 'Rating updated successfully' };
                }
                else {
                    const res = yield propertyRoom_1.default.updateOne({ _id: roomId }, { $push: {
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
        });
    }
    saveOrUnSavePost(postId, save_or_unsave, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (save_or_unsave == 'save') {
                    const res = yield savePostModel_1.default.updateOne({ userId }, { $push: { postIds: postId } }, { upsert: true });
                    console.log('save post response :', res);
                    if (res.modifiedCount > 0 || res.upsertedCount > 0) {
                        return { success: true, message: 'Your post is saved..!' };
                    }
                    else {
                        return { success: false, message: 'Oops..! There is an issue when saving the post.' };
                    }
                }
                else if (save_or_unsave == 'unsave') {
                    const doc = yield savePostModel_1.default.findOne({ userId });
                    if (doc) {
                        const index = doc.postIds.findIndex((item) => item === postId);
                        if (index) {
                            doc.postIds.splice(index, 1);
                            yield doc.save();
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
        });
    }
    isPostSaved(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield savePostModel_1.default.findOne({ userId });
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
        });
    }
    likeOrUnLikePost(postId, Like_or_unLike, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Like_or_unLike === 'like') {
                    const doc = yield PostModel_1.PostModel.updateOne({ _id: postId }, { $push: { like: userId } });
                    if (doc.modifiedCount > 0) {
                        const post = yield PostModel_1.PostModel.findById(postId).populate('comments');
                        return { success: true, message: 'Liked succesfully..!', post };
                    }
                    else {
                        return { success: false, message: 'There is an issue to like this post...!' };
                    }
                }
                else if (Like_or_unLike === 'unlike') {
                    const doc = yield PostModel_1.PostModel.findById(postId);
                    if (doc) {
                        const index = doc.like.findIndex(item => item === userId);
                        if (index !== -1) {
                            doc.like.splice(index, 1);
                            yield doc.save();
                            const post = yield PostModel_1.PostModel.findById(postId).populate('comments');
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
        });
    }
    isPostLiked(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield PostModel_1.PostModel.findById(postId);
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
        });
    }
    fetchPostLikersData(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('fectch post likers data :', postId);
                const post = yield PostModel_1.PostModel.findById(postId);
                if (post) {
                    const likersData = yield Promise.all(post.like.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const userData = yield userModel_1.UserModel.findById(item);
                        const propertyData = yield propertyModel_1.default.findById(item);
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
                    })));
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
        });
    }
    deletePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield PostModel_1.PostModel.deleteOne({ _id: postId });
                console.log(res);
                if (res.deletedCount > 0) {
                    const posts = yield PostModel_1.PostModel.find({ userId });
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
        });
    }
    reportPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield PostReportModel_1.default.insertMany([data]);
                return res;
            }
            catch (error) {
                console.log('report post error : ', error);
            }
        });
    }
}
exports.default = PostRepository;
