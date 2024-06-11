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
class FollowUseCase {
    constructor(IfollowRepo, IuserRepo) {
        this.IfollowRepo = IfollowRepo;
        this.IuserRepo = IuserRepo;
    }
    FollowRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const followingType = data.isProperty ? 'property' :'user'
                // const findFollowing = await this.IuserRepo.findUserById(data.followerId,followingType)
                // console.log('findFollowing:',findFollowing);
                // if(findFollowing){
                //     const Res = await this.IfollowRepo.sendFollowReqest(data)
                // }
                const Res = yield this.IfollowRepo.sendFollowReqest(data);
                return Res;
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
    unFollowRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Res = yield this.IfollowRepo.unFollowReqest(data);
                return Res;
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
    checkIsFollwoed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Res = yield this.IfollowRepo.checkIsFollwoed(data);
                return Res;
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
    isFollwerRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Res = yield this.IfollowRepo.getFollwerRequest(data.userId);
                return Res;
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
    confirmFollReq(_a) {
        return __awaiter(this, arguments, void 0, function* ({ followerId, userId }) {
            try {
                const Res = yield this.IfollowRepo.confirmFollReq(followerId, userId);
                return Res;
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
    cancelFollReq(_a) {
        return __awaiter(this, arguments, void 0, function* ({ followerId, followingId }) {
            try {
                const Res = yield this.IfollowRepo.cancelFollReq(followerId, followingId);
                return Res;
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
    fetchAllFollowData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let followingData = [], followerData = [];
                const Res = yield this.IfollowRepo.getAllFollwers(userId);
                followingData = Res.following.filter((item) => item.isAccepted);
                followerData = Res.follower.filter((item) => item.isAccepted);
                return { followerData: followerData, followingData: followingData };
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
    fetchFollowerOriginalData(userId, isFollowing) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Res = yield this.IfollowRepo.getAllFollwers(userId);
                // console.log('========>',Res); 
                let followerData;
                if (isFollowing === 'true') {
                    followerData = yield Promise.all(Res.following.map((item) => __awaiter(this, void 0, void 0, function* () {
                        if (item.isAccepted) {
                            const id = item.followingID;
                            const type = item.isProperty ? 'property' : 'user';
                            const ResData = yield this.IfollowRepo.getFollowRealData(id, type);
                            if (type === 'user') {
                                return {
                                    Profile: ResData.data.Profile,
                                    Name: ResData.data.firstName,
                                    isProperty: false,
                                    id: ResData.data._id
                                };
                            }
                            else {
                                return {
                                    Profile: ResData.data.PropertyProfile,
                                    Name: ResData.data.PropertyName,
                                    isProperty: true,
                                    id: ResData.data._id
                                };
                            }
                        }
                    })));
                }
                else if (isFollowing === 'false') {
                    followerData = yield Promise.all(Res.follower.map((item) => __awaiter(this, void 0, void 0, function* () {
                        if (item.isAccepted) {
                            const id = item.followerID;
                            const type = item.isProperty ? 'property' : 'user';
                            const ResData = yield this.IfollowRepo.getFollowRealData(id, type);
                            console.log('Res Data :', ResData);
                            if (type === 'user') {
                                return {
                                    Profile: ResData.data.Profile,
                                    Name: ResData.data.firstName,
                                    isProperty: false,
                                    id: ResData.data._id
                                };
                            }
                            else {
                                return {
                                    Profile: ResData.data.PropertyProfile,
                                    Name: ResData.data.PropertyName,
                                    isProperty: true,
                                    id: ResData.data._id
                                };
                            }
                        }
                    })));
                }
                console.log('follwer data :====>', followerData);
                return { followerData };
            }
            catch (error) {
                console.log('Followrequest error in Follow user case :', error);
            }
        });
    }
}
exports.default = FollowUseCase;
