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
const BookingModel_1 = __importDefault(require("../database/BookingModel"));
const PostModel_1 = require("../database/PostModel");
const PostReportModel_1 = __importDefault(require("../database/PostReportModel"));
const deletedPost_1 = __importDefault(require("../database/deletedPost"));
const propertyModel_1 = __importDefault(require("../database/propertyModel"));
const userModel_1 = require("../database/userModel");
class AdminRepository {
    findCountOfProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = (yield propertyModel_1.default.find()).length;
                return count;
            }
            catch (error) {
                console.log('find count of properties :', error);
            }
        });
    }
    findCountOfUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = (yield userModel_1.UserModel.find()).length;
                return count;
            }
            catch (error) {
                console.log('find count of properties :', error);
            }
        });
    }
    findCountOfBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = (yield BookingModel_1.default.find()).length;
                return count;
            }
            catch (error) {
                console.log('find count of properties :', error);
            }
        });
    }
    fetchDashBoardGraphData(DataType, matchCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(DataType, matchCondition);
                let data;
                if (DataType === 'users') {
                    const users = yield userModel_1.UserModel.find(matchCondition).exec();
                    if (users) {
                        data = users.map((item) => (item.createdAt));
                    }
                }
                else if (DataType === 'Properties') {
                    const properties = yield propertyModel_1.default.find(matchCondition).exec();
                    if (properties) {
                        data = properties.map(item => item.createdAt);
                    }
                }
                else if (DataType === 'bookings') {
                    const Bookings = yield BookingModel_1.default.find(matchCondition).exec();
                    if (Bookings) {
                        data = Bookings.map(item => item.createdAt);
                    }
                }
                return data;
            }
            catch (error) {
                console.log('fetch dash board graph data error :', error);
            }
        });
    }
    fetchAllUserData(userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userType === 'user') {
                    const data = yield userModel_1.UserModel.find();
                    if (data) {
                        return { success: true, data };
                    }
                    else {
                        return { success: false, data: [] };
                    }
                }
                else if (userType === 'property') {
                    const data = yield propertyModel_1.default.find();
                    if (data) {
                        return { success: true, data };
                    }
                    else {
                        return { success: false, data: [] };
                    }
                }
            }
            catch (error) {
                console.log('fetchAllUserData error in admin repository');
            }
        });
    }
    handleBlockOrUnblock(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userType === 'user') {
                    const user = yield userModel_1.UserModel.findOne({ _id: userId });
                    if (user) {
                        user.isBlocked = !user.isBlocked;
                        user.save();
                        return { success: true, message: 'Blocking Status updated..!' };
                    }
                    else {
                        return { success: false, message: 'cannot find the user..!' };
                    }
                }
                else {
                    const property = yield propertyModel_1.default.findOne({ _id: userId });
                    if (property) {
                        property.isBlocked = !property.isBlocked;
                        property.save();
                        return { success: true, message: 'Blocking Status updated..!' };
                    }
                    else {
                        return { success: false, message: 'cannot find the porperty..!' };
                    }
                }
            }
            catch (error) {
                console.log('handle Block or un block error :', error);
            }
        });
    }
    fetchAllBookingData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield BookingModel_1.default.find();
                if (bookings) {
                    yield Promise.all((bookings.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                        const property = yield propertyModel_1.default.findOne({ _id: item.propertyId });
                        bookings[index].propertyName = property === null || property === void 0 ? void 0 : property.PropertyName;
                        bookings[index].propertyProfile = property === null || property === void 0 ? void 0 : property.PropertyProfile;
                    }))));
                    return { success: true, bookings };
                }
                else {
                    return { success: false, message: 'oops..! no bookings..', bookings: [] };
                }
            }
            catch (error) {
                console.log('fetch all booking data :', error);
            }
        });
    }
    fetchAllPostReportData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allReports = yield PostReportModel_1.default.find();
                if (allReports) {
                    const updatedReports = yield Promise.all(allReports.map((item) => __awaiter(this, void 0, void 0, function* () {
                        let reporterName = '';
                        if (item.reporterType === 'user') {
                            const user = yield userModel_1.UserModel.findOne({ _id: item.reporterId });
                            if (user) {
                                reporterName = user.firstName;
                            }
                        }
                        else {
                            const property = yield propertyModel_1.default.findOne({ _id: item.reporterId });
                            if (property) {
                                reporterName = property.PropertyName;
                            }
                        }
                        console.log('reporterName:', reporterName);
                        return Object.assign(Object.assign({}, item.toObject()), { // Convert MongoDB document to plain JavaScript object
                            reporterName });
                    })));
                    // console.log(updatedReports);
                    return { success: true, data: updatedReports };
                }
                else {
                    return { success: false, message: 'Oops..! no reports found.', data: [] };
                }
            }
            catch (error) {
                console.log('fetch all post report data:', error);
                return { success: false, message: 'Error fetching post report data.', data: [] };
            }
        });
    }
    findUserPostById(postId, isDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('it is deleted post +++++> ', postId, isDeleted);
                let post;
                if (isDeleted === 'false') {
                    console.log('it is deleted post**** ');
                    post = yield PostModel_1.PostModel.findOne({ _id: postId });
                }
                else if (isDeleted === 'true') {
                    post = yield deletedPost_1.default.findOne({ _id: postId });
                    console.log('it is deleted post -----');
                }
                if (post) {
                    return { success: true, data: post };
                }
                else {
                    return { success: false, message: 'cannot find the post' };
                }
            }
            catch (error) {
                console.log('findUserPostById error :', error);
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield PostModel_1.PostModel.findByIdAndDelete(postId);
                const updateRes = yield PostReportModel_1.default.updateOne({ postId }, { $set: { status: 'Deleted' } });
                console.log('update Res :', updateRes);
                if (post) {
                    const res = yield deletedPost_1.default.insertMany([post]);
                    if (res) {
                        return { success: true, message: 'Successfully post deleted ' };
                    }
                    else {
                        return { success: false, message: ' Post deletion failed ' };
                    }
                }
            }
            catch (error) {
                console.log('deletePost error in post repository :', error);
                return { success: false, message: 'cannot delete the post ' };
            }
        });
    }
}
exports.default = AdminRepository;
