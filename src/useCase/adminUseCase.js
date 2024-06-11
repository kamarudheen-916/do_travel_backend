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
class AdminUseCase {
    constructor(iAdminRepository, jwt) {
        this.iAdminRepository = iAdminRepository;
        this.jwt = jwt;
    }
    adminLogin(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminName = 'Admin@123';
                const password = 'Admin@123';
                if ((loginData.adminName == adminName) && (loginData.password === password)) {
                    const JWT_KEY = process.env.JWT_KEY;
                    if (JWT_KEY) {
                        const token = this.jwt.createJWT('123456789', 'admin');
                        return { success: true, message: 'successfully admin loged in...!', token, user: 'admin' };
                    }
                }
                else {
                    return { success: false, message: 'admin loged in failed..!' };
                }
            }
            catch (error) {
                console.log('admin login error :', error);
                return { success: false, message: 'admin loged in failed..!' };
            }
        });
    }
    fetchDashBoardCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numberUsers = yield this.iAdminRepository.findCountOfUser();
                const numberProperties = yield this.iAdminRepository.findCountOfProperties();
                const numberBooking = yield this.iAdminRepository.findCountOfBookings();
                if (numberProperties && numberUsers) {
                    return { success: true, numberProperties, numberUsers, numberBooking };
                }
                else {
                    return { success: false, message: 'cannot fetch the data ...!' };
                }
            }
            catch (error) {
                console.log('fetch dash board data : ', error);
                return { success: false, message: 'cannot fetch the data ...!' };
            }
        });
    }
    fetchDashBoardGraphData(DataType, DateType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(DataType, DateType);
                const today = new Date();
                let matchCondition;
                switch (DateType) {
                    case 'year':
                        matchCondition = {
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: '$createdAt' }, today.getFullYear()] },
                                    { $eq: [{ $month: '$createdAt' }, today.getMonth() + 1] },
                                    { $eq: [{ $dayOfMonth: '$createdAt' }, today.getDate()] },
                                ],
                            },
                        };
                        break;
                    case 'day':
                        matchCondition = {
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: '$createdAt' }, today.getFullYear()] },
                                    { $eq: [{ $month: '$createdAt' }, today.getMonth() + 1] },
                                ],
                            },
                        };
                        break;
                    case 'month':
                        matchCondition = {
                            $expr: {
                                $eq: [{ $year: '$createdAt' }, today.getFullYear()],
                            },
                        };
                        break;
                    case 'all':
                        matchCondition = {};
                        break;
                    default:
                        return { success: false, message: 'Invalid DateType provided' };
                }
                const datas = yield this.iAdminRepository.fetchDashBoardGraphData(DataType, matchCondition);
                let originalData;
                console.log('datas :', datas);
                if (DateType === 'day') {
                    const od = datas.map((item) => new Date(item).getDate().toString());
                    let fullData = {};
                    od.forEach((item) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
                    const data = Object.keys(fullData).map(key => ({
                        name: `Day ${key}`,
                        count: fullData[key],
                    }));
                    console.log(data);
                    originalData = data;
                }
                else if (DateType === 'month') {
                    const od = datas.map((item) => new Date(item).toLocaleString('default', { month: 'short' }));
                    let fullData = {};
                    od.forEach((item) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
                    const data = Object.keys(fullData).map(key => ({
                        name: key,
                        count: fullData[key],
                    }));
                    console.log(data);
                    originalData = data;
                }
                else if (DateType === 'year') {
                    const od = datas.map((item) => new Date(item).getFullYear().toString());
                    let fullData = {};
                    od.forEach((item) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
                    const data = Object.keys(fullData).map(key => ({
                        name: key,
                        count: fullData[key],
                    }));
                    console.log(data);
                    originalData = data;
                }
                else if (DateType === 'all') {
                    const od = datas.map((item) => new Date(item).getFullYear().toString());
                    let fullData = {};
                    od.forEach((item) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
                    const data = Object.keys(fullData).map(key => ({
                        name: key,
                        count: fullData[key],
                    }));
                    console.log(data);
                    originalData = data;
                }
                return { success: true, data: originalData };
            }
            catch (error) {
                console.log('fetch dashboard graph data:', error);
                return { success: false, message: 'Cannot fetch the data ...!' };
            }
        });
    }
    fetchAllUserData(userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.iAdminRepository.fetchAllUserData(userType);
                return data;
            }
            catch (error) {
                console.log('fetchAllUserData error : ', error);
                return { success: false, message: 'cannot fetch the data ...!' };
            }
        });
    }
    handleBlockOrUnblock(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.iAdminRepository.handleBlockOrUnblock(userId, userType);
                return data;
            }
            catch (error) {
                console.log('fetchAllUserData error : ', error);
                return { success: false, message: 'cannot fetch the data ...!' };
            }
        });
    }
    fetchAllBookingData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.iAdminRepository.fetchAllBookingData();
                return data;
            }
            catch (error) {
                console.log('fetchAllUserData error : ', error);
                return { success: false, message: 'cannot fetch the data ...!' };
            }
        });
    }
    fetchAllPostReportData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.iAdminRepository.fetchAllPostReportData();
                return data;
            }
            catch (error) {
                console.log('fetchAllUserData error : ', error);
                return { success: false, message: 'cannot fetch the data ...!' };
            }
        });
    }
    findUserPostById(postId, isDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.iAdminRepository.findUserPostById(postId, isDeleted);
                return data;
            }
            catch (error) {
                console.log('fetchAllUserData error : ', error);
                return { success: false, message: 'cannot fetch the data ...!' };
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iAdminRepository.deletePost(postId);
                return res;
            }
            catch (error) {
                console.log('isPostLiked error in userUserCase', error);
            }
        });
    }
}
exports.default = AdminUseCase;
