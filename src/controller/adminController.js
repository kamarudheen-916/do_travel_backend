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
class AdminController {
    constructor(adminUserCase, userCase) {
        this.adminUserCase = adminUserCase;
        this.userCase = userCase;
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = req.body;
                const Res = yield this.adminUserCase.adminLogin(loginData);
                res.json(Res);
            }
            catch (error) {
                console.log('admin login error in admin controller :', error);
            }
        });
    }
    fetchDashBoardCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Res = yield this.adminUserCase.fetchDashBoardCount();
                res.json(Res);
            }
            catch (error) {
                console.log('admin fetchDashBoardCount error in admin controller :', error);
            }
        });
    }
    fetchDashBoardGraphData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { DataType, DateType } = req.query;
                const Res = yield this.adminUserCase.fetchDashBoardGraphData(DataType, DateType);
                res.json(Res);
            }
            catch (error) {
                console.log('admin fetchDashBoardGraphData error in admin controller :', error);
            }
        });
    }
    fetchAllUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userType = req.query.userType;
                const Res = yield this.adminUserCase.fetchAllUserData(userType);
                res.json(Res);
            }
            catch (error) {
                console.log('admin fetchAllUserData error in admin controller :', error);
            }
        });
    }
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const userType = req.query.userType;
                console.log('userid:', userId);
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
                const userId = req.query.userId;
                const userType = req.query.userType;
                const userData = req.body;
                const Res = yield this.userCase.updateUserData(userData, userId, userType);
                res.json(Res);
            }
            catch (error) {
                console.log('get user data for edit user detail in profile error :', error);
            }
        });
    }
    uploadImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfile = req.body.fileURL;
                const userId = req.query.userId;
                const userType = req.query.userType;
                const resp = yield this.userCase.uploadUserProfile(userProfile, userId, userType);
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
    handleBlockOrUnblock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const userType = req.query.userType;
                const resp = yield this.adminUserCase.handleBlockOrUnblock(userId, userType);
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
    fetchAllBookingData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield this.adminUserCase.fetchAllBookingData();
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
    fetchAllPostReportData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield this.adminUserCase.fetchAllPostReportData();
                return res.json(resp);
            }
            catch (error) {
                console.log('fetchAllPostReportData error in userController :', error);
            }
        });
    }
    findUserPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.query.postId;
                const isDeleted = req.query.isDeleted;
                const resp = yield this.adminUserCase.findUserPostById(postId, isDeleted);
                return res.json(resp);
            }
            catch (error) {
                console.log('uploadImg error in userController :', error);
            }
        });
    }
    adminDeletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.query;
                const Response = yield this.adminUserCase.deletePost(postId);
                res.json(Response);
            }
            catch (error) {
                console.log('deletePost error in userController :', error);
            }
        });
    }
}
exports.default = AdminController;
