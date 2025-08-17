"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../database/userModel");
const propertyModel_1 = __importDefault(require("../database/propertyModel"));
const PostModel_1 = require("../database/PostModel");
const themeModel_1 = __importDefault(require("../database/themeModel"));
class UserRepository {
    async findByEmail(email, userType) {
        try {
            const userExist = userType === 'user' ? await userModel_1.UserModel.findOne({ email: email }) : await propertyModel_1.default.findOne({ email: email });
            return userExist ? userExist : null;
        }
        catch (error) {
            console.log('find by email error :', error);
            return null;
        }
    }
    async saveUser(user, userType) {
        try {
            const result = userType === 'user' ?
                await userModel_1.UserModel.create(user) :
                await propertyModel_1.default.create(user);
            setTimeout(async () => {
                const result = userType === 'user' ?
                    await userModel_1.UserModel.updateOne({ email: user.email }, {
                        $set: {
                            OTP: '****'
                        }
                    }) :
                    await propertyModel_1.default.updateOne({ email: user.email }, {
                        $set: {
                            OTP: '****'
                        }
                    });
            }, 90000);
            return result;
        }
        catch (error) {
            console.log('save user error in userRepository:', error);
            return null;
        }
    }
    async insertPost(data) {
        try {
            const post = data.fileUrl;
            const description = data.textarea;
            const userId = data.userId;
            const isProperty = data.userType === 'property' ? true : false;
            const PostProfile = data.Profile;
            const PostName = data.userName;
            const Response = await PostModel_1.PostModel.insertMany({ post, description, userId, isProperty, PostProfile, PostName });
            return Response;
        }
        catch (error) {
            console.log('isertUserPost error in repository');
            return null;
        }
    }
    async findPostByUserId(userId, userType) {
        try {
            const allPost = await PostModel_1.PostModel.find({ userId }).populate('comments');
            return allPost;
        }
        catch (error) {
            console.log('findPostByUserIdError in user Repositoty:', error);
        }
    }
    async findUserById(userId, userType) {
        try {
            let user;
            if (userType === 'user') {
                user = await userModel_1.UserModel.findOne({ _id: userId });
            }
            else {
                user = await propertyModel_1.default.findOne({ _id: userId });
            }
            return user;
        }
        catch (error) {
            console.log('findUserById error in user Repository :', error);
        }
    }
    async uploadUserProfile(profile, userId, userType) {
        try {
            if (userType === 'user')
                return await userModel_1.UserModel.updateOne({ _id: userId }, { $set: { Profile: profile } });
            else if (userType === 'property')
                return await propertyModel_1.default.updateOne({ _id: userId }, { $set: { PropertyProfile: profile } });
            else
                return { success: false, message: 'unautharised user' };
        }
        catch (error) {
            console.log('findUserById error in user Repository :', error);
        }
    }
    async getUserData(userId, userType) {
        try {
            let user;
            if (userType == 'user') {
                user = await userModel_1.UserModel.findOne({ _id: userId });
            }
            else {
                user = await propertyModel_1.default.findOne({ _id: userId });
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
    }
    async updateUserData(userData, userId, userType) {
        try {
            if (!userType || !userId) {
                throw new Error('userType or userId is undefined');
            }
            let Res;
            if (userType === 'user') {
                Res = await userModel_1.UserModel.findByIdAndUpdate(userId, userData, { new: true });
            }
            else {
                Res = await propertyModel_1.default.findByIdAndUpdate(userId, userData, { new: true });
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
    }
    async userSearch(searchData, userId, userType) {
        try {
            const searchRegex = new RegExp(searchData, 'i');
            const users = await userModel_1.UserModel.find({ firstName: { $regex: searchRegex } });
            return users;
        }
        catch (error) {
            console.log('User search error:', error);
            throw error;
        }
    }
    async setThemeMode(mode, userId) {
        try {
            const res = await themeModel_1.default.updateOne({ userId }, { $set: { ThemeMode: mode } }, { upsert: true });
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
    }
    async getThemeMode(userId) {
        try {
            const res = await themeModel_1.default.findOne({ userId });
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
    }
    async propertySearch(searchData, userId, userType) {
        try {
            const searchRegex = new RegExp(searchData, 'i');
            const users = await propertyModel_1.default.find({ PropertyName: { $regex: searchRegex } });
            return users;
        }
        catch (error) {
            console.log('User search error:', error);
            throw error;
        }
    }
}
exports.default = UserRepository;
