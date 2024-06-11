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
const followModel_1 = __importDefault(require("../database/followModel"));
const propertyModel_1 = __importDefault(require("../database/propertyModel"));
const userModel_1 = require("../database/userModel");
class FollowRepository {
    sendFollowReqest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ requesterId, isRequesterProperty, followerId, isProperty, }) {
            try {
                console.log('isProperty:', isProperty);
                const data = {
                    followerID: requesterId,
                    follwingDate: new Date(),
                    isAccepted: false,
                    isProperty: isRequesterProperty,
                };
                const followingData = {
                    followingID: followerId,
                    follwingDate: new Date(),
                    isAccepted: false,
                    isProperty: isProperty,
                };
                const followingDoc = yield followModel_1.default.findOne({ userId: followerId });
                const requesterDoc = yield followModel_1.default.findOne({ userId: requesterId });
                if (followingDoc) {
                    followingDoc.follower.push(data);
                    yield followingDoc.save();
                }
                else {
                    yield followModel_1.default.create({
                        userId: followerId,
                        follower: [data],
                    });
                }
                if (requesterDoc) {
                    requesterDoc.following.push(followingData);
                    yield requesterDoc.save();
                }
                else {
                    yield followModel_1.default.create({
                        userId: requesterId,
                        following: [followingData]
                    });
                }
                return { success: true };
            }
            catch (error) {
                console.error("Error sending follow request:", error);
                return { success: false, error };
            }
        });
    }
    unFollowReqest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ requesterId, followerId, isProperty, }) {
            try {
                const followingDoc = yield followModel_1.default.findOne({ userId: followerId });
                const requesterDoc = yield followModel_1.default.findOne({ userId: requesterId });
                if (followingDoc) {
                    const index = followingDoc.follower.findIndex((item) => item.followerID === requesterId);
                    followingDoc.follower.splice(index, 1);
                    yield followingDoc.save();
                }
                if (requesterDoc) {
                    const index = requesterDoc.following.findIndex((item) => item.followingID === followerId);
                    requesterDoc.following.splice(index, 1);
                    yield requesterDoc.save();
                }
                return { success: true };
            }
            catch (error) {
                console.log('Error unfollow request :', error);
                return { success: false, error };
            }
        });
    }
    checkIsFollwoed(_a) {
        return __awaiter(this, arguments, void 0, function* ({ requesterId, followerId, isProperty, }) {
            var _b;
            try {
                const doc = yield followModel_1.default.findOne({ userId: followerId });
                console.log('isAlreadyRequested doc:', doc);
                if (!doc || doc.follower.length < 1) {
                    return { success: false };
                }
                const isAlreadyRequested = doc.follower.filter((item) => item.followerID === requesterId);
                console.log('isAlreadyRequested:', isAlreadyRequested);
                if (isAlreadyRequested && isAlreadyRequested.length > 0) {
                    // const isAccepted = doc.following.some((item)=>item.isAccepted)
                    return { success: true, isAccepted: (_b = isAlreadyRequested[0]) === null || _b === void 0 ? void 0 : _b.isAccepted };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error("Error checkIsFollwoed:", error);
                return { success: false, error };
            }
        });
    }
    getFollwerRequest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield followModel_1.default.findOne({ userId: userId });
                if (doc) {
                    const filteredFollowReqData = doc.follower.filter((item) => !item.isAccepted);
                    let followReqData = yield Promise.all(filteredFollowReqData.map((item) => __awaiter(this, void 0, void 0, function* () {
                        if (!item.isProperty) {
                            const data = yield userModel_1.UserModel.findOne({ _id: item.followerID }, { _id: 0, firstName: 1, Profile: 1 }).lean();
                            return {
                                notificationProfile: data === null || data === void 0 ? void 0 : data.Profile,
                                notificationName: data === null || data === void 0 ? void 0 : data.firstName,
                                isProperty: item.isProperty,
                                followingId: item.followerID,
                            };
                        }
                        else {
                            const data = yield propertyModel_1.default.findOne({ _id: item.followerID }, { _id: 0, PropertyName: 1, PropertyProfile: 1 }).lean();
                            return {
                                notificationProfile: data === null || data === void 0 ? void 0 : data.PropertyProfile,
                                notificationName: data === null || data === void 0 ? void 0 : data.PropertyName,
                                isProperty: item.isProperty,
                                followingId: item.followerID,
                            };
                        }
                    })));
                    return followReqData;
                }
                else {
                    return [];
                }
            }
            catch (error) {
                console.error("Error checkIsFollwoed:", error);
                return { success: false, error };
            }
        });
    }
    confirmFollReq(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield followModel_1.default.updateOne({ userId, "follower.followerID": followerId }, { $set: { "follower.$.isAccepted": true } });
                const res = yield followModel_1.default.updateOne({ userId: followerId, "following.followingID": userId }, { $set: { "following.$.isAccepted": true } });
                if (doc.modifiedCount !== undefined && doc.modifiedCount > 0 && res.modifiedCount !== undefined && res.modifiedCount > 0) {
                    console.log('confirm follow request');
                    return { success: true, message: 'follow req confirmed' };
                }
                else {
                    console.log(`Follow request not found for followerId: ${followerId}`);
                    return { success: false, message: 'follow req confirmed issues is there..!' };
                }
            }
            catch (error) {
                console.error("Error confirmFollReq:", error);
                return { success: false, error };
            }
        });
    }
    cancelFollReq(followerId, followingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followerData = yield followModel_1.default.findOne({ userId: followerId });
                if (followerData) {
                    const docIndex = followerData.following.findIndex((item) => item.followingID === followingId);
                    followerData.following.splice(docIndex, 1);
                    followerData.save();
                }
                else {
                    return { success: false, message: ' cancell request failed..!' };
                }
                const followingData = yield followModel_1.default.findOne({ userId: followingId });
                if (followingData) {
                    const docIndex = followingData.follower.findIndex((item) => item.followerID === followerId);
                    followingData.follower.splice(docIndex, 1);
                    followingData.save();
                }
                else {
                    return { success: false, message: ' cancell request failed..!' };
                }
                return { success: true, message: 'successfully cancell request cancelled..!' };
            }
            catch (error) {
                console.error("Error cancelFollReq:", error);
                return { success: false, error };
            }
        });
    }
    getAllFollwers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Res = yield followModel_1.default.findOne({ userId });
                return Res !== null ? Res : {};
            }
            catch (error) {
                console.error("Error getAllFollwers:", error);
                return null;
            }
        });
    }
    getFollowRealData(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id, type);
                let follData;
                if (type === 'user') {
                    follData = yield userModel_1.UserModel.findOne({ _id: id });
                }
                else {
                    follData = yield propertyModel_1.default.findOne({ _id: id });
                }
                if (follData) {
                    return { success: true, data: follData };
                }
                else {
                    return { success: false, message: 'fetch follower or following data error', data: [] };
                }
            }
            catch (error) {
                console.log('get followers real data error :', error);
                return { success: false, message: 'fetch follower or following data error' };
            }
        });
    }
}
exports.default = FollowRepository;
