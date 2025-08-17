"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class hashPassword {
    async createHash(password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        return hashedPassword;
    }
    async compare(password, hashedPassword) {
        const passwordMatch = await bcrypt_1.default.compare(password, hashedPassword);
        return passwordMatch;
    }
}
exports.default = hashPassword;
