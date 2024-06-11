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
class ChatUserCase {
    constructor(IChatRepo) {
        this.IChatRepo = IChatRepo;
    }
    sendMessage(message, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IChatRepo.sendMessage(message, senderId, receiverId);
                return res;
            }
            catch (error) {
                console.log('sendMessage error in userUseCase:', error);
                throw error;
            }
        });
    }
    getMessages(userToChatId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.IChatRepo.getMessages(userToChatId, senderId);
                return res;
            }
            catch (error) {
                console.log('getMessages error in userUsercase', error);
                throw error;
            }
        });
    }
    getUsersForSidebar(loggedInUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('userid ***>', loggedInUserId);
                const res = yield this.IChatRepo.getUsersForSidebar(loggedInUserId);
                return res;
            }
            catch (error) {
                console.log('getMessages error in userUseCase:', error);
                throw error;
            }
        });
    }
}
exports.default = ChatUserCase;
