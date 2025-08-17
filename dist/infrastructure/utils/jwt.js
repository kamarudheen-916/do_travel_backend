"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTocken {
    createJWT(userId, role) {
        const JWTkey = process.env.JWT_KEY;
        if (JWTkey) {
            const Tocken = jsonwebtoken_1.default.sign({ id: userId, role: role }, JWTkey);
            return Tocken;
        }
        throw new Error('JWT Tocken is not defined..!');
    }
    verifyJWT(token) {
        try {
            console.log('verify jwt');
            const JWTkey = process.env.JWT_KEY;
            const decode = jsonwebtoken_1.default.verify(token, JWTkey);
            console.log('decode ', decode);
            return decode;
        }
        catch (error) {
            console.log('verifyJWT error : ', error);
            return null;
        }
    }
}
exports.default = JwtTocken;
