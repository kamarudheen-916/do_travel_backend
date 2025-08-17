"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("../utils/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = new jwt_1.default();
dotenv_1.default.config();
const adminAuth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
        }
        const decodedToken = jwt.verifyJWT(token);
        if ((decodedToken) && (decodedToken.role !== 'admin')) {
            return res.status(401).send({ success: false, message: 'Unauthorized - Invalid Token' });
        }
        if (decodedToken && decodedToken.id) {
            req.userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id;
            req.userType = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
            console.log('chech admin auth');
            next();
        }
        else {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
    }
};
exports.default = adminAuth;
