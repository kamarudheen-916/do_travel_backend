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
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor(userCase) {
        this.userCase = userCase;
    }
    signUpUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { FormData, userType } = req.body;
                const Response = yield this.userCase.userSignUp(FormData, userType);
                res.json(Response);
            }
            catch (error) {
                console.log('signup error : ', error);
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const OTPData = req.body;
                const verifyOtp = yield this.userCase.verifyOTP(OTPData.OTP, OTPData.userId, OTPData.userType);
                res.json(verifyOtp);
            }
            catch (error) {
                console.log('verifyOTP error in userController');
            }
        });
    }
    signUpProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { FormData, userType } = req.body;
                const property = yield this.userCase.PropertySignUP(FormData, userType);
                res.json(property);
            }
            catch (error) {
                console.log('signup error : ', error);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { formData, userType } = req.body;
                const { email, password } = formData;
                const user = yield this.userCase.userLogin({ email, password, userType });
                return res.json(user);
            }
            catch (error) {
                console.log('loginPost error ', error);
            }
        });
    }
    checkIsBlocked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //this function is doing nothing here, it is used to check the user is blocked or not 
                // that checking is happening the the user auth middle ware form the user router page
                console.log('test is biloked ...');
                return;
            }
            catch (error) {
                console.log('loginPost error ', error);
            }
        });
    }
    forgottenPass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { forgetFormData, userType } = req.body;
                const { email, password, confirmPassword } = forgetFormData;
                const newPass = yield this.userCase.forgottenPassword(email, password, confirmPassword, userType);
                return res.json(newPass);
            }
            catch (error) {
                console.log('forgotten password error :', error);
            }
        });
    }
    verifyForgottenOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const IsVerified = yield this.userCase.verifyForgottenOTP(data);
                return res.json(IsVerified);
            }
            catch (error) {
                console.log('verifyForgottenOTP error :', error);
            }
        });
    }
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userType, email } = req.params;
                if (userType === undefined) {
                    res.json({ success: false, message: 'Please try again..!' });
                }
                else {
                    const isRsendOTP = yield this.userCase.ResendOTP(userType, email);
                    if (isRsendOTP) {
                        res.json({ success: true, message: 'Resend OTP successful' });
                    }
                    else {
                        res.json({ sucess: false, message: 'Resend OTP failed..!' });
                    }
                }
            }
            catch (error) {
                console.log('resend otp error in userController', error);
            }
        });
    }
    userCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const PostData = req.body;
                const Response = yield this.userCase.userCreate(PostData);
                res.json(Response);
            }
            catch (error) {
                console.log('userCreate error in user Controller', error);
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const userType = req.userType;
                const Response = yield this.userCase.getAllPosts(userId, userType);
                res.json(Response);
            }
            catch (error) {
                console.log('getAllPost error in userController :', error);
            }
        });
    }
    getAllFeeds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const userType = req.userType;
                const Response = yield this.userCase.getAllFeeds(userId, userType);
                res.json(Response);
            }
            catch (error) {
                console.log('getAllPost error in userController :', error);
            }
        });
    }
    getOthersProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId, profileType } = req.query;
                const userID = typeof profileId === 'string' ? profileId : undefined;
                if (userID === undefined) {
                    throw new Error('userId is undefined or not a string');
                }
                const userType = typeof profileType === 'string' ? profileType : undefined;
                if (userID === undefined) {
                    throw new Error('userType is undefined or not a string');
                }
                const getPosts = yield this.userCase.getAllPosts(userID, profileType);
                const userData = yield this.userCase.getUserData(userID, userType);
                res.json({ getPosts, userData });
            }
            catch (error) {
                console.log('getOthersProfile error in userController:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const userType = req.userType;
                const Res = yield this.userCase.getUserData(userId, userType);
                res.json(Res);
            }
            catch (error) {
                console.log('get user data for edit user detail in profile error :', error);
            }
        });
    }
    updateUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const userType = req.userType;
                const userData = req.body;
                const Res = yield this.userCase.updateUserData(userData, userId, userType);
                res.json(Res);
            }
            catch (error) {
                console.log('get user data for edit user detail in profile error :', error);
            }
        });
    }
    postComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const Response = yield this.userCase.postComment(req.body, req.userId, req.userType);
                res.json(Response);
            }
            catch (error) {
                console.log('postComment error in userController :', error);
            }
        });
    }
    postReplayComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, replayCommentId, replayComment } = req.body;
                const Response = yield this.userCase.postReplayComment(postId, replayCommentId, replayComment, req.userId, req.userType);
                res.json(Response);
            }
            catch (error) {
                console.log('postComment error in userController :', error);
            }
        });
    }
    fetchReplayComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId } = req.query;
                const Response = yield this.userCase.fetchReplayComment(commentId);
                res.json(Response);
            }
            catch (error) {
                console.log('postComment error in userController :', error);
            }
        });
    }
    reportPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const data = req.body;
                data.reporterId = req.userId;
                data.status = 'reported';
                data.reporterType = req.userType;
                const Response = yield this.userCase.reportPost(data);
                res.json(Response);
            }
            catch (error) {
                console.log('postComment error in userController :', error);
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = req.body;
                postData.userType = req.userType;
                const Response = yield this.userCase.deleteComment(postData);
                return res.json(Response);
            }
            catch (error) {
                console.log('delete comment error in userController :', error);
            }
        });
    }
    editComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editData = req.body;
                console.log(editData);
                const userType = req.userType;
                const Response = yield this.userCase.editComment(editData, userType);
                return res.json(Response);
            }
            catch (error) {
                console.log('edit comment error in userController :', error);
            }
        });
    }
    updateRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RatingData = req.body;
                console.log('RatingData:', RatingData);
                const userId = req.userId;
                const Response = yield this.userCase.updateRating(RatingData, userId);
                return res.json(Response);
            }
            catch (error) {
                console.log('edit comment error in userController :', error);
            }
        });
    }
    saveOrUnSavePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, isSave } = req.body;
                const userId = req.userId;
                const save_or_unsave = isSave ? 'unsave' : 'save';
                console.log('save or unsave :', save_or_unsave);
                const Response = yield this.userCase.saveOrUnSavePost(postId, save_or_unsave, userId);
                return res.json(Response);
            }
            catch (error) {
                console.log('saveOrUnSavePost error in userController :', error);
            }
        });
    }
    likeOrUnLikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, isLiked } = req.body;
                const userId = req.userId;
                const Like_or_unLike = isLiked ? 'unlike' : 'like';
                console.log('like or unlike :', Like_or_unLike);
                const Response = yield this.userCase.likeOrUnLikePost(postId, Like_or_unLike, userId);
                return res.json(Response);
            }
            catch (error) {
                console.log('likeOrUnLikePost error in userController :', error);
            }
        });
    }
    isPostSaved(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { postId } = req.query;
                const Response = yield this.userCase.isPostSaved(postId, userId);
                res.json(Response);
            }
            catch (error) {
                console.log('isPostSaved error in userController :', error);
            }
        });
    }
    isPostLiked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { postId } = req.query;
                const Response = yield this.userCase.isPostLiked(postId, userId);
                res.json(Response);
            }
            catch (error) {
                console.log('isPostLiked error in userController :', error);
            }
        });
    }
    fetchPostLikersData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.query;
                const Response = yield this.userCase.fetchPostLikersData(postId);
                res.json(Response);
            }
            catch (error) {
                console.log('isPostLiked error in userController :', error);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { postId } = req.query;
                const Response = yield this.userCase.deletePost(postId, userId);
                res.json(Response);
            }
            catch (error) {
                console.log('deletePost error in userController :', error);
            }
        });
    }
    uploadImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfile = req.body.fileURL;
                const userId = req.userId;
                const userType = req.userType;
                const resp = yield this.userCase.uploadUserProfile(userProfile, userId, userType);
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
    userSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchData = req.query.searchData;
                const userId = req.userId;
                const userType = req.userType;
                const resp = yield this.userCase.userSearch(searchData, userId, userType);
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
    setThemeMode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mode = req.body.mode;
                const userId = req.userId;
                const resp = yield this.userCase.setThemeMode(mode, userId);
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
    getThemeMode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const resp = yield this.userCase.getThemeMode(userId);
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
}
exports.default = UserController;
