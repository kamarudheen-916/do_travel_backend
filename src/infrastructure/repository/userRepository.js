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
const userModel_1 = require("../database/userModel");
const propertyModel_1 = __importDefault(require("../database/propertyModel"));
const PostModel_1 = require("../database/PostModel");
const themeModel_1 = __importDefault(require("../database/themeModel"));
class UserRepository {
    findByEmail(email, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExist = userType === 'user' ? yield userModel_1.UserModel.findOne({ email: email }) : yield propertyModel_1.default.findOne({ email: email });
                return userExist ? userExist : null;
            }
            catch (error) {
                console.log('find by email error :', error);
                return null;
            }
        });
    }
    saveUser(user, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = userType === 'user' ?
                    yield userModel_1.UserModel.create(user) :
                    yield propertyModel_1.default.create(user);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const result = userType === 'user' ?
                        yield userModel_1.UserModel.updateOne({ email: user.email }, {
                            $set: {
                                OTP: '****'
                            }
                        }) :
                        yield propertyModel_1.default.updateOne({ email: user.email }, {
                            $set: {
                                OTP: '****'
                            }
                        });
                }), 90000);
                return result;
            }
            catch (error) {
                console.log('save user error in userRepository:', error);
                return null;
            }
        });
    }
    insertPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = data.fileUrl;
                const description = data.textarea;
                const userId = data.userId;
                const isProperty = data.userType === 'property' ? true : false;
                const PostProfile = data.Profile;
                const PostName = data.userName;
                const Response = yield PostModel_1.PostModel.insertMany({ post, description, userId, isProperty, PostProfile, PostName });
                return Response;
            }
            catch (error) {
                console.log('isertUserPost error in repository');
                return null;
            }
        });
    }
    findPostByUserId(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPost = yield PostModel_1.PostModel.find({ userId }).populate('comments');
                return allPost;
            }
            catch (error) {
                console.log('findPostByUserIdError in user Repositoty:', error);
            }
        });
    }
    findUserById(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (userType === 'user') {
                    user = yield userModel_1.UserModel.findOne({ _id: userId });
                }
                else {
                    user = yield propertyModel_1.default.findOne({ _id: userId });
                }
                return user;
            }
            catch (error) {
                console.log('findUserById error in user Repository :', error);
            }
        });
    }
    uploadUserProfile(profile, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userType === 'user')
                    return yield userModel_1.UserModel.updateOne({ _id: userId }, { $set: { Profile: profile } });
                else if (userType === 'property')
                    return yield propertyModel_1.default.updateOne({ _id: userId }, { $set: { PropertyProfile: profile } });
                else
                    return { success: false, message: 'unautharised user' };
            }
            catch (error) {
                console.log('findUserById error in user Repository :', error);
            }
        });
    }
    getUserData(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (userType == 'user') {
                    user = yield userModel_1.UserModel.findOne({ _id: userId });
                }
                else {
                    user = yield propertyModel_1.default.findOne({ _id: userId });
                }
                if (user) {
                    return { success: true, message: 'user data', user };
                }
                else {
                    return { success: false, message: 'cannot fetch user data' };
                }
            }
            catch (error) {
                console.log('get user data error in user repository', error);
                return { success: false, message: 'cannot fetch user data', error };
            }
        });
    }
    updateUserData(userData, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userType || !userId) {
                    throw new Error('userType or userId is undefined');
                }
                let Res;
                if (userType === 'user') {
                    Res = yield userModel_1.UserModel.findByIdAndUpdate(userId, userData, { new: true });
                }
                else {
                    Res = yield propertyModel_1.default.findByIdAndUpdate(userId, userData, { new: true });
                }
                if (!Res) {
                    throw new Error('No documents were modified');
                }
                return { success: true, message: 'Profile successfully updated' };
            }
            catch (error) {
                console.log('update user Data error:', error);
                throw error;
            }
        });
    }
    userSearch(searchData, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchRegex = new RegExp(searchData, 'i');
                const users = yield userModel_1.UserModel.find({ firstName: { $regex: searchRegex } });
                return users;
            }
            catch (error) {
                console.log('User search error:', error);
                throw error;
            }
        });
    }
    setThemeMode(mode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield themeModel_1.default.updateOne({ userId }, { $set: { ThemeMode: mode } }, { upsert: true });
                if (res) {
                    return { success: true, message: 'successfully mode changed' };
                }
                else {
                    return { success: false, message: 'failed mode changed' };
                }
            }
            catch (error) {
                console.log('set Theme mode error in user reopository');
            }
        });
    }
    getThemeMode(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield themeModel_1.default.findOne({ userId });
                if (res) {
                    return res.ThemeMode;
                }
                else {
                    return 'normalMode';
                }
            }
            catch (error) {
                console.log('set Theme mode error in user reopository');
            }
        });
    }
    propertySearch(searchData, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchRegex = new RegExp(searchData, 'i');
                const users = yield propertyModel_1.default.find({ PropertyName: { $regex: searchRegex } });
                return users;
            }
            catch (error) {
                console.log('User search error:', error);
                throw error;
            }
        });
    }
}
exports.default = UserRepository;
