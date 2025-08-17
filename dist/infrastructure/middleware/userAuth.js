"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("../utils/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const jwt = new jwt_1.default();
const repository = new userRepository_1.default();
dotenv_1.default.config();
const UserAuth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        }
        const decodedToken = jwt.verifyJWT(token);
        if ((decodedToken) && (decodedToken.role !== 'user' && decodedToken.role !== 'property')) {
            return res.status(401).send({ success: false, message: 'Unauthorized - Invalid Token' });
        }
        if (decodedToken && decodedToken.id) {
            let user = await repository.findUserById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role);
            if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                return res.status(401).send({ success: false, message: 'User is blocked !!' });
            }
            else {
                req.userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id;
                req.userType = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role;
                next();
            }
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
exports.default = UserAuth;
