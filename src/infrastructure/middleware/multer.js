"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyLicenseUpload = exports.propertyUpload = exports.userProfileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const userProfileStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/UserProfileImages/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const propertyStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/Images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const propertyLicenseStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/propertyLicenseImage/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
exports.userProfileUpload = (0, multer_1.default)({ storage: userProfileStorage });
exports.propertyUpload = (0, multer_1.default)({ storage: propertyStorage });
exports.propertyLicenseUpload = (0, multer_1.default)({ storage: propertyLicenseStorage });
