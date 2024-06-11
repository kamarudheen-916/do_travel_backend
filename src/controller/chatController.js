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
class ChatController {
    constructor(chatUserCase) {
        this.chatUserCase = chatUserCase;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = req.body.message;
                const senderId = req.userId;
                const receiverId = req.params.id;
                const resp = yield this.chatUserCase.sendMessage(message, senderId, receiverId);
                res.status(201).json(resp);
            }
            catch (error) {
                console.log("Error in sentMessages controller: ", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: userToChatId } = req.params;
                const senderId = req.userId;
                const resp = yield this.chatUserCase.getMessages(userToChatId, senderId);
                res.status(201).json(resp);
            }
            catch (error) {
                console.log("Error in getMessages controller: ", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getUsersForSidebar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedInUserId = req.userId;
                const resp = yield this.chatUserCase.getUsersForSidebar(loggedInUserId);
                res.status(201).json(resp);
            }
            catch (error) {
                console.error("Error in getUsersForSidebar: ", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.default = ChatController;
