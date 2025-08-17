"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminUseCase {
    constructor(iAdminRepository, jwt) {
        this.iAdminRepository = iAdminRepository;
        this.jwt = jwt;
    }
    async adminLogin(loginData) {
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
    }
    async fetchDashBoardCount() {
        try {
            const numberUsers = await this.iAdminRepository.findCountOfUser();
            const numberProperties = await this.iAdminRepository.findCountOfProperties();
            const numberBooking = await this.iAdminRepository.findCountOfBookings();
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
    }
    async fetchDashBoardGraphData(DataType, DateType) {
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
            const datas = await this.iAdminRepository.fetchDashBoardGraphData(DataType, matchCondition);
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
    }
    async fetchAllUserData(userType) {
        try {
            const data = await this.iAdminRepository.fetchAllUserData(userType);
            return data;
        }
        catch (error) {
            console.log('fetchAllUserData error : ', error);
            return { success: false, message: 'cannot fetch the data ...!' };
        }
    }
    async handleBlockOrUnblock(userId, userType) {
        try {
            const data = await this.iAdminRepository.handleBlockOrUnblock(userId, userType);
            return data;
        }
        catch (error) {
            console.log('fetchAllUserData error : ', error);
            return { success: false, message: 'cannot fetch the data ...!' };
        }
    }
    async fetchAllBookingData() {
        try {
            const data = await this.iAdminRepository.fetchAllBookingData();
            return data;
        }
        catch (error) {
            console.log('fetchAllUserData error : ', error);
            return { success: false, message: 'cannot fetch the data ...!' };
        }
    }
    async fetchAllPostReportData() {
        try {
            const data = await this.iAdminRepository.fetchAllPostReportData();
            return data;
        }
        catch (error) {
            console.log('fetchAllUserData error : ', error);
            return { success: false, message: 'cannot fetch the data ...!' };
        }
    }
    async findUserPostById(postId, isDeleted) {
        try {
            const data = await this.iAdminRepository.findUserPostById(postId, isDeleted);
            return data;
        }
        catch (error) {
            console.log('fetchAllUserData error : ', error);
            return { success: false, message: 'cannot fetch the data ...!' };
        }
    }
    async deletePost(postId) {
        try {
            const res = await this.iAdminRepository.deletePost(postId);
            return res;
        }
        catch (error) {
            console.log('isPostLiked error in userUserCase', error);
        }
    }
}
exports.default = AdminUseCase;
