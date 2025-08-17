"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../infrastructure/database/userModel");
const propertyModel_1 = __importDefault(require("../infrastructure/database/propertyModel"));
class UserUseCase {
    constructor(IfollowRepository, iUserRepository, IpostRepository, IRoomRepository, hashPass, jwt, cloudinary, generateOTP, sendMail) {
        this.IfollowRepository = IfollowRepository;
        this.iUserRepository = iUserRepository;
        this.IpostRepository = IpostRepository;
        this.IRoomRepository = IRoomRepository;
        this.hashPass = hashPass;
        this.jwt = jwt;
        this.cloudinary = cloudinary;
        this.generateOTP = generateOTP;
        this.sendMail = sendMail;
    }
    async userSignUp(userData, userType) {
        try {
            const email = userData.email;
            const isUser = await this.iUserRepository.findByEmail(email, userType);
            if (isUser) {
                return { success: false, message: 'This Email is already exists' };
            }
            else {
                const password = userData.password;
                const hashedPassword = await this.hashPass.createHash(password);
                userData.password = hashedPassword;
                const imageUrl = userData.Profile !== '' ?
                    await this.cloudinary.saveToCloudinary(userData === null || userData === void 0 ? void 0 : userData.Profile) : '';
                userData.Profile = imageUrl;
                const OTP = await this.generateOTP.generateOTP();
                userData.OTP = OTP.toString();
                this.sendMail.sendMail(userData.firstName, email, OTP);
                const userSave = await this.iUserRepository.saveUser(userData, userType);
                if (userSave) {
                    return { success: true, message: 'Signup successful..!', Data: userSave };
                }
                else {
                    return { success: false, message: 'Something error' };
                }
            }
        }
        catch (error) {
            console.log('user singup error in UserUseCase :', error);
        }
    }
    async PropertySignUP(propertyData, userType) {
        try {
            const isProperty = await this.iUserRepository.findByEmail(propertyData.email, userType);
            if (isProperty) {
                return { success: false, message: 'This Email is already exist..!' };
            }
            else {
                const hashedPassword = await this.hashPass.createHash(propertyData.password);
                propertyData.password = hashedPassword;
                const OTP = await this.generateOTP.generateOTP();
                propertyData.OTP = OTP.toString();
                this.sendMail.sendMail(propertyData.PropertyName, propertyData.email, OTP);
                const propetySave = await this.iUserRepository.saveUser(propertyData, userType);
                if (!propetySave) {
                    return { success: false, message: 'Something error' };
                }
                else {
                    return { success: true, message: 'User successfully signed up', Data: propetySave };
                }
            }
        }
        catch (error) {
            console.log('Propety SingUP error in UserUsecase : ', error);
        }
    }
    async verifyOTP(OTP, userId, userType) {
        try {
            const user = userType === 'user' ?
                await userModel_1.UserModel.findById(userId) :
                await propertyModel_1.default.findById(userId);
            // console.log('OTP:',OTP,'--','real OTP :',user?.OTP,'userType:',userType);
            if (OTP == (user === null || user === void 0 ? void 0 : user.OTP)) {
                const result = userType === 'user' ?
                    await userModel_1.UserModel.updateOne({ _id: userId }, { $set: {
                            IsVerified: true
                        } }) :
                    await propertyModel_1.default.updateOne({ _id: userId }, { $set: {
                            IsVerified: true
                        } });
                return { success: true, message: 'Signup successful..!' };
            }
            else {
                return { success: false, message: 'OTP is not verified..!' };
            }
        }
        catch (error) {
            console.log('verifyOTP error in UserUseCase ', error);
        }
    }
    async userLogin({ email, password, userType }) {
        try {
            const isUser = await this.iUserRepository.findByEmail(email, userType);
            if (!isUser) {
                return { success: false, message: 'This Email does not exist..!' };
            }
            else {
                const isPassMatch = await this.hashPass.compare(password, isUser.password);
                if (!isPassMatch) {
                    return { success: false, message: 'Invalid Password..!' };
                }
                else if (isUser.isBlocked) {
                    return { success: false, message: 'User is Blocked By Admin..!' };
                }
                else {
                    const JWT_KEY = process.env.JWT_KEY;
                    if (JWT_KEY) {
                        const token = this.jwt.createJWT(isUser._id, userType);
                        return { success: true, message: 'Successfully logged in', token, user: isUser };
                    }
                }
            }
        }
        catch (error) {
            console.log('login error in useCase : ', error);
        }
    }
    async forgottenPassword(email, newPassword, confPass, userType) {
        try {
            if (newPassword === confPass) {
                const RealOTP = await this.generateOTP.generateOTP();
                const model = userType === 'user' ? userModel_1.UserModel : propertyModel_1.default;
                await model.updateOne({ email }, { $set: { OTP: RealOTP } });
                this.sendMail.sendMail(email, email, RealOTP);
                setTimeout(async () => {
                    const result = userType === 'user' ?
                        await userModel_1.UserModel.updateOne({ email: email }, {
                            $set: {
                                OTP: '****'
                            }
                        }) :
                        await propertyModel_1.default.updateOne({ email: email }, {
                            $set: {
                                OTP: '****'
                            }
                        });
                }, 90000);
                const hashedPassword = await this.hashPass.createHash(newPassword);
                return { success: true, email, hashedPassword, userType, RealOTP };
            }
            else {
                return { success: false, message: 'Mismatch Password..!' };
            }
        }
        catch (error) {
            console.log('forgotten password error :', error);
        }
    }
    async verifyForgottenOTP(data) {
        const User = data.userType === 'user' ?
            await userModel_1.UserModel.findOne({ email: data.email }) :
            await propertyModel_1.default.findOne({ email: data.email });
        const RealOTP = User === null || User === void 0 ? void 0 : User.OTP;
        if (data.OTP == RealOTP) {
            const Model = data.userType === 'user' ? userModel_1.UserModel : propertyModel_1.default;
            await Model.updateOne({ email: data.email }, { $set: { password: data.hashedPassword } });
            return { success: true, message: 'Password successfully changed..' };
        }
        else {
            return { success: false, message: 'Invalid OTP..!' };
        }
    }
    async ResendOTP(userType, email) {
        try {
            const RealOTP = await this.generateOTP.generateOTP();
            const result = userType === 'user' ?
                await userModel_1.UserModel.updateOne({ email: email }, {
                    $set: {
                        OTP: RealOTP
                    }
                }) :
                await propertyModel_1.default.updateOne({ email: email }, {
                    $set: {
                        OTP: RealOTP
                    }
                });
            this.sendMail.sendMail(email, email, RealOTP);
            setTimeout(async () => {
                const result = userType === 'user' ?
                    await userModel_1.UserModel.updateOne({ email: email }, {
                        $set: {
                            OTP: '****'
                        }
                    }) :
                    await propertyModel_1.default.updateOne({ email: email }, {
                        $set: {
                            OTP: '****'
                        }
                    });
            }, 90000);
            return RealOTP;
        }
        catch (error) {
            console.log('ResenOTP erro in useUseCase', error);
        }
    }
    async userCreate(postData) {
        try {
            if (postData.userId && postData.userType) {
                const fileUrl = postData.fileUrl !== '' ?
                    await this.cloudinary.saveToCloudinary(postData === null || postData === void 0 ? void 0 : postData.fileUrl) : '';
                postData.fileUrl = fileUrl;
                const Response = await this.iUserRepository.insertPost(postData);
                if (Response) {
                    return { success: true, message: 'Post successful..' };
                }
                else {
                    return { success: false, message: 'Oops..! something went wrong..' };
                }
            }
            else {
                throw new Error('undefined userId or user type : in userUserCase : in userCreate');
            }
        }
        catch (error) {
            console.log('userCreate Error in user use case :', error);
        }
    }
    async uploadUserProfile(userProfile, userId, userType) {
        try {
            const fileUrl = await this.cloudinary.saveToCloudinary(userProfile);
            const res = await this.iUserRepository.uploadUserProfile(fileUrl, userId, userType);
            if (res.modifiedCount > 0) {
                return { success: true, message: 'Profile updated..!', fileUrl };
            }
            else {
                return { success: false, message: 'Profile update failed..!' };
            }
        }
        catch (error) {
            console.log('uploadUserProfile error in userUseCase ', error);
        }
    }
    async getAllPosts(userId, userType) {
        try {
            const allPosts = await this.iUserRepository.findPostByUserId(userId, userType);
            if (allPosts) {
                const reversedPosts = allPosts.reverse();
                return { success: true, message: 'fetch data success', allPosts: reversedPosts };
            }
            else {
                return { success: false, message: 'fetch data failed' };
            }
        }
        catch (error) {
            console.log('getallPosts error in userUseCase ', error);
        }
    }
    async getAllFeeds(userId, userType) {
        var _a;
        try {
            const allFollowings = await this.IfollowRepository.getAllFollwers(userId);
            if (allFollowings.following) {
                const allFeeds = await Promise.all((_a = allFollowings.following) === null || _a === void 0 ? void 0 : _a.map(async (following) => {
                    let feeds = [];
                    if (following.isAccepted) {
                        feeds = await this.iUserRepository.findPostByUserId(following.followingID, following.isProperty ? 'property' : 'user');
                    }
                    return feeds;
                }));
                if (allFeeds) {
                    const reversedPosts = allFeeds.reverse().flat();
                    return { success: true, message: 'fetch data success', allFeeds: reversedPosts };
                }
                else {
                    return { success: false, message: 'fetch data failed' };
                }
            }
        }
        catch (error) {
            console.log('getallFeeds error in userUseCase ', error);
        }
    }
    async getUserData(userId, userType) {
        try {
            const res = await this.iUserRepository.getUserData(userId, userType);
            return res;
        }
        catch (error) {
            console.log('get user data for edit user detail in profile error :', error);
        }
    }
    async updateUserData(userData, userId, userType) {
        try {
            const email = userData.email;
            const isUser = await this.iUserRepository.findUserById(userId, userType);
            if (!isUser) {
                return { success: false, message: 'This Email is already exists' };
            }
            else {
                if (userData.password === '') {
                    userData.password = isUser === null || isUser === void 0 ? void 0 : isUser.password;
                }
                else {
                    const password = userData.password;
                    const hashedPassword = await this.hashPass.createHash(password);
                    userData.password = hashedPassword;
                }
                const res = await this.iUserRepository.updateUserData(userData, userId, userType);
                return res;
            }
        }
        catch (error) {
            console.log('update user data for edit user detail in profile error :', error);
        }
    }
    async postComment({ comment, postId }, userId, userType) {
        try {
            const res = await this.IpostRepository.addComment(comment, postId, userId, userType);
            if (res) {
                return { success: true, message: 'Comment posted.', res };
            }
            else {
                return { sucess: false, message: 'oops..! Cannot post you comment..!' };
            }
        }
        catch (error) {
            console.log('postComment error in userUseCase ', error);
        }
    }
    async postReplayComment(postId, replayCommentId, replayComment, userId, userType) {
        try {
            const comment = await this.IpostRepository.postReplayComment(postId, replayCommentId, replayComment, userId, userType);
            if (comment) {
                return { success: true, message: 'Comment posted.', replayComments: comment.replayComments };
            }
            else {
                return { sucess: false, message: 'oops..! Cannot post you comment..!' };
            }
        }
        catch (error) {
            console.log('postReplayComment error in userUseCase ', error);
        }
    }
    async fetchReplayComment(commentId) {
        try {
            const replayComments = await this.IpostRepository.fetchReplayComment(commentId);
            if (replayComments) {
                return { success: true, message: 'Comment posted.', replayComments };
            }
            else {
                return { sucess: false, message: 'oops..! Cannot get your comment..!' };
            }
        }
        catch (error) {
            console.log('fetchReplayComment error in userUseCase ', error);
        }
    }
    async reportPost(data) {
        try {
            const res = await this.IpostRepository.reportPost(data);
            if (res) {
                return { success: true, message: 'Your Report is successfull..' };
            }
            else {
                return { sucess: false, message: 'oops..!, you cannot report on this post' };
            }
        }
        catch (error) {
            console.log('postComment error in userUseCase ', error);
        }
    }
    async deleteComment(data) {
        try {
            const res = await this.IpostRepository.deleteComment(data.postId, data.commentId, data.index, data.userType);
            return res;
        }
        catch (error) {
            console.log('delete comment error in userUserCase', error);
        }
    }
    async editComment(data, userType) {
        try {
            const res = await this.IpostRepository.editComment(data.postId, data.commentId, data.editedComment, userType);
            return res;
        }
        catch (error) {
            console.log('delete comment error in userUserCase', error);
        }
    }
    async updateRating(RatingData, userId) {
        try {
            const res = await this.IpostRepository.updateRating(RatingData.roomId, RatingData.rating, userId, RatingData.ratingComment);
            return res;
        }
        catch (error) {
            console.log('delete comment error in userUserCase', error);
        }
    }
    async saveOrUnSavePost(postId, save_or_unsave, userId) {
        try {
            const res = await this.IpostRepository.saveOrUnSavePost(postId, save_or_unsave, userId);
            return res;
        }
        catch (error) {
            console.log('delete comment error in userUserCase', error);
        }
    }
    async likeOrUnLikePost(postId, Like_or_unLike, userId) {
        try {
            const res = await this.IpostRepository.likeOrUnLikePost(postId, Like_or_unLike, userId);
            return res;
        }
        catch (error) {
            console.log('delete comment error in userUserCase', error);
        }
    }
    async isPostSaved(postId, userId) {
        try {
            const res = await this.IpostRepository.isPostSaved(postId, userId);
            return res;
        }
        catch (error) {
            console.log('isPostSaved error in userUserCase', error);
        }
    }
    async isPostLiked(postId, userId) {
        try {
            const res = await this.IpostRepository.isPostLiked(postId, userId);
            return res;
        }
        catch (error) {
            console.log('isPostLiked error in userUserCase', error);
        }
    }
    async fetchPostLikersData(postId) {
        try {
            const res = await this.IpostRepository.fetchPostLikersData(postId);
            return res;
        }
        catch (error) {
            console.log('isPostLiked error in userUserCase', error);
        }
    }
    async deletePost(postId, userId) {
        try {
            const res = await this.IpostRepository.deletePost(postId, userId);
            return res;
        }
        catch (error) {
            console.log('isPostLiked error in userUserCase', error);
        }
    }
    async add_edit_Room(roomData, isEdit) {
        try {
            const images = roomData.images;
            const cloudinaryImages = await Promise.all(images.map(async (img) => {
                return await this.cloudinary.saveToCloudinary(img);
            }));
            roomData.images = cloudinaryImages;
            const res = await this.IRoomRepository.addOrEditRoom(roomData, isEdit);
            return res;
        }
        catch (error) {
            console.log('add room error in userUseCase:', error);
            throw error;
        }
    }
    async deleteRoom(roomId) {
        try {
            const res = await this.IRoomRepository.deleteRoom(roomId);
            return res;
        }
        catch (error) {
            console.log('add room error in userUseCase :', error);
        }
    }
    async fetchRoomData(userId) {
        try {
            const res = await this.IRoomRepository.fetchRoomData(userId);
            return res;
        }
        catch (error) {
            console.log('add room error in userUseCase :', error);
        }
    }
    async userSearch(search_Data, userId, userType) {
        try {
            const searchedUsers = await this.iUserRepository.userSearch(search_Data, userId, userType);
            const searchedProperty = await this.iUserRepository.propertySearch(search_Data, userId, userType);
            let searchResult = [];
            searchedUsers.forEach((user, index) => {
                const result = {
                    name: user.firstName,
                    profileId: user._id,
                    profile: user.Profile,
                    isProperty: false,
                };
                searchResult.push(result);
            });
            searchedProperty.forEach((Property, index) => {
                const result = {
                    name: Property.PropertyName,
                    profileId: Property._id,
                    profile: Property.PropertyProfile,
                    isProperty: true
                };
                searchResult.push(result);
            });
            return searchResult;
        }
        catch (error) {
            console.log('add room error in userUseCase :', error);
        }
    }
    async setThemeMode(mode, userId) {
        try {
            const res = await this.iUserRepository.setThemeMode(mode, userId);
            return res;
        }
        catch (error) {
            console.log('setThemeMode error in userUseCase:', error);
            throw error;
        }
    }
    async getThemeMode(userId) {
        try {
            const res = await this.iUserRepository.getThemeMode(userId);
            return res;
        }
        catch (error) {
            console.log('setThemeMode error in userUseCase:', error);
            throw error;
        }
    }
}
exports.default = UserUseCase;
