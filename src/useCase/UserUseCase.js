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
    userSignUp(userData, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = userData.email;
                const isUser = yield this.iUserRepository.findByEmail(email, userType);
                if (isUser) {
                    return { success: false, message: 'This Email is already exists' };
                }
                else {
                    const password = userData.password;
                    const hashedPassword = yield this.hashPass.createHash(password);
                    userData.password = hashedPassword;
                    const imageUrl = userData.Profile !== '' ?
                        yield this.cloudinary.saveToCloudinary(userData === null || userData === void 0 ? void 0 : userData.Profile) : '';
                    userData.Profile = imageUrl;
                    const OTP = yield this.generateOTP.generateOTP();
                    userData.OTP = OTP.toString();
                    this.sendMail.sendMail(userData.firstName, email, OTP);
                    const userSave = yield this.iUserRepository.saveUser(userData, userType);
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
        });
    }
    PropertySignUP(propertyData, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isProperty = yield this.iUserRepository.findByEmail(propertyData.email, userType);
                if (isProperty) {
                    return { success: false, message: 'This Email is already exist..!' };
                }
                else {
                    const hashedPassword = yield this.hashPass.createHash(propertyData.password);
                    propertyData.password = hashedPassword;
                    const OTP = yield this.generateOTP.generateOTP();
                    propertyData.OTP = OTP.toString();
                    this.sendMail.sendMail(propertyData.PropertyName, propertyData.email, OTP);
                    const propetySave = yield this.iUserRepository.saveUser(propertyData, userType);
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
        });
    }
    verifyOTP(OTP, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = userType === 'user' ?
                    yield userModel_1.UserModel.findById(userId) :
                    yield propertyModel_1.default.findById(userId);
                // console.log('OTP:',OTP,'--','real OTP :',user?.OTP,'userType:',userType);
                if (OTP == (user === null || user === void 0 ? void 0 : user.OTP)) {
                    const result = userType === 'user' ?
                        yield userModel_1.UserModel.updateOne({ _id: userId }, { $set: {
                                IsVerified: true
                            } }) :
                        yield propertyModel_1.default.updateOne({ _id: userId }, { $set: {
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
        });
    }
    userLogin(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, userType }) {
            try {
                const isUser = yield this.iUserRepository.findByEmail(email, userType);
                if (!isUser) {
                    return { success: false, message: 'This Email does not exist..!' };
                }
                else {
                    const isPassMatch = yield this.hashPass.compare(password, isUser.password);
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
        });
    }
    forgottenPassword(email, newPassword, confPass, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (newPassword === confPass) {
                    const RealOTP = yield this.generateOTP.generateOTP();
                    const model = userType === 'user' ? userModel_1.UserModel : propertyModel_1.default;
                    yield model.updateOne({ email }, { $set: { OTP: RealOTP } });
                    this.sendMail.sendMail(email, email, RealOTP);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        const result = userType === 'user' ?
                            yield userModel_1.UserModel.updateOne({ email: email }, {
                                $set: {
                                    OTP: '****'
                                }
                            }) :
                            yield propertyModel_1.default.updateOne({ email: email }, {
                                $set: {
                                    OTP: '****'
                                }
                            });
                    }), 90000);
                    const hashedPassword = yield this.hashPass.createHash(newPassword);
                    return { success: true, email, hashedPassword, userType, RealOTP };
                }
                else {
                    return { success: false, message: 'Mismatch Password..!' };
                }
            }
            catch (error) {
                console.log('forgotten password error :', error);
            }
        });
    }
    verifyForgottenOTP(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = data.userType === 'user' ?
                yield userModel_1.UserModel.findOne({ email: data.email }) :
                yield propertyModel_1.default.findOne({ email: data.email });
            const RealOTP = User === null || User === void 0 ? void 0 : User.OTP;
            if (data.OTP == RealOTP) {
                const Model = data.userType === 'user' ? userModel_1.UserModel : propertyModel_1.default;
                yield Model.updateOne({ email: data.email }, { $set: { password: data.hashedPassword } });
                return { success: true, message: 'Password successfully changed..' };
            }
            else {
                return { success: false, message: 'Invalid OTP..!' };
            }
        });
    }
    ResendOTP(userType, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RealOTP = yield this.generateOTP.generateOTP();
                const result = userType === 'user' ?
                    yield userModel_1.UserModel.updateOne({ email: email }, {
                        $set: {
                            OTP: RealOTP
                        }
                    }) :
                    yield propertyModel_1.default.updateOne({ email: email }, {
                        $set: {
                            OTP: RealOTP
                        }
                    });
                this.sendMail.sendMail(email, email, RealOTP);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const result = userType === 'user' ?
                        yield userModel_1.UserModel.updateOne({ email: email }, {
                            $set: {
                                OTP: '****'
                            }
                        }) :
                        yield propertyModel_1.default.updateOne({ email: email }, {
                            $set: {
                                OTP: '****'
                            }
                        });
                }), 90000);
                return RealOTP;
            }
            catch (error) {
                console.log('ResenOTP erro in useUseCase', error);
            }
        });
    }
    userCreate(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (postData.userId && postData.userType) {
                    const fileUrl = postData.fileUrl !== '' ?
                        yield this.cloudinary.saveToCloudinary(postData === null || postData === void 0 ? void 0 : postData.fileUrl) : '';
                    postData.fileUrl = fileUrl;
                    const Response = yield this.iUserRepository.insertPost(postData);
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
        });
    }
    uploadUserProfile(userProfile, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileUrl = yield this.cloudinary.saveToCloudinary(userProfile);
                const res = yield this.iUserRepository.uploadUserProfile(fileUrl, userId, userType);
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
        });
    }
    getAllPosts(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPosts = yield this.iUserRepository.findPostByUserId(userId, userType);
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
        });
    }
    getAllFeeds(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const allFollowings = yield this.IfollowRepository.getAllFollwers(userId);
                if (allFollowings.following) {
                    const allFeeds = yield Promise.all((_a = allFollowings.following) === null || _a === void 0 ? void 0 : _a.map((following) => __awaiter(this, void 0, void 0, function* () {
                        let feeds = [];
                        if (following.isAccepted) {
                            feeds = yield this.iUserRepository.findPostByUserId(following.followingID, following.isProperty ? 'property' : 'user');
                        }
                        return feeds;
                    })));
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
        });
    }
    getUserData(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iUserRepository.getUserData(userId, userType);
                return res;
            }
            catch (error) {
                console.log('get user data for edit user detail in profile error :', error);
            }
        });
    }
    updateUserData(userData, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = userData.email;
                const isUser = yield this.iUserRepository.findUserById(userId, userType);
                if (!isUser) {
                    return { success: false, message: 'This Email is already exists' };
                }
                else {
                    if (userData.password === '') {
                        userData.password = isUser === null || isUser === void 0 ? void 0 : isUser.password;
                    }
                    else {
                        const password = userData.password;
                        const hashedPassword = yield this.hashPass.createHash(password);
                        userData.password = hashedPassword;
                    }
                    const res = yield this.iUserRepository.updateUserData(userData, userId, userType);
                    return res;
                }
            }
            catch (error) {
                console.log('update user data for edit user detail in profile error :', error);
            }
        });
    }
    postComment(_a, userId_1, userType_1) {
        return __awaiter(this, arguments, void 0, function* ({ comment, postId }, userId, userType) {
            try {
                const res = yield this.IpostRepository.addComment(comment, postId, userId, userType);
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
        });
    }
    postReplayComment(postId, replayCommentId, replayComment, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.IpostRepository.postReplayComment(postId, replayCommentId, replayComment, userId, userType);
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
        });
    }
    fetchReplayComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const replayComments = yield this.IpostRepository.fetchReplayComment(commentId);
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
        });
    }
    reportPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.reportPost(data);
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
        });
    }
    deleteComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.deleteComment(data.postId, data.commentId, data.index, data.userType);
                return res;
            }
            catch (error) {
                console.log('delete comment error in userUserCase', error);
            }
        });
    }
    editComment(data, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.editComment(data.postId, data.commentId, data.editedComment, userType);
                return res;
            }
            catch (error) {
                console.log('delete comment error in userUserCase', error);
            }
        });
    }
    updateRating(RatingData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.updateRating(RatingData.roomId, RatingData.rating, userId, RatingData.ratingComment);
                return res;
            }
            catch (error) {
                console.log('delete comment error in userUserCase', error);
            }
        });
    }
    saveOrUnSavePost(postId, save_or_unsave, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.saveOrUnSavePost(postId, save_or_unsave, userId);
                return res;
            }
            catch (error) {
                console.log('delete comment error in userUserCase', error);
            }
        });
    }
    likeOrUnLikePost(postId, Like_or_unLike, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.likeOrUnLikePost(postId, Like_or_unLike, userId);
                return res;
            }
            catch (error) {
                console.log('delete comment error in userUserCase', error);
            }
        });
    }
    isPostSaved(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.isPostSaved(postId, userId);
                return res;
            }
            catch (error) {
                console.log('isPostSaved error in userUserCase', error);
            }
        });
    }
    isPostLiked(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.isPostLiked(postId, userId);
                return res;
            }
            catch (error) {
                console.log('isPostLiked error in userUserCase', error);
            }
        });
    }
    fetchPostLikersData(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.fetchPostLikersData(postId);
                return res;
            }
            catch (error) {
                console.log('isPostLiked error in userUserCase', error);
            }
        });
    }
    deletePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IpostRepository.deletePost(postId, userId);
                return res;
            }
            catch (error) {
                console.log('isPostLiked error in userUserCase', error);
            }
        });
    }
    add_edit_Room(roomData, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = roomData.images;
                const cloudinaryImages = yield Promise.all(images.map((img) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.cloudinary.saveToCloudinary(img);
                })));
                roomData.images = cloudinaryImages;
                const res = yield this.IRoomRepository.addOrEditRoom(roomData, isEdit);
                return res;
            }
            catch (error) {
                console.log('add room error in userUseCase:', error);
                throw error;
            }
        });
    }
    deleteRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IRoomRepository.deleteRoom(roomId);
                return res;
            }
            catch (error) {
                console.log('add room error in userUseCase :', error);
            }
        });
    }
    fetchRoomData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IRoomRepository.fetchRoomData(userId);
                return res;
            }
            catch (error) {
                console.log('add room error in userUseCase :', error);
            }
        });
    }
    userSearch(search_Data, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchedUsers = yield this.iUserRepository.userSearch(search_Data, userId, userType);
                const searchedProperty = yield this.iUserRepository.propertySearch(search_Data, userId, userType);
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
        });
    }
    setThemeMode(mode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iUserRepository.setThemeMode(mode, userId);
                return res;
            }
            catch (error) {
                console.log('setThemeMode error in userUseCase:', error);
                throw error;
            }
        });
    }
    getThemeMode(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iUserRepository.getThemeMode(userId);
                return res;
            }
            catch (error) {
                console.log('setThemeMode error in userUseCase:', error);
                throw error;
            }
        });
    }
}
exports.default = UserUseCase;
