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
class propertyController {
    constructor(usercase) {
        this.usercase = usercase;
    }
    propertyCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const PostData = req.body;
                const Response = yield this.usercase.userCreate(PostData);
                res.json(Response);
            }
            catch (error) {
                console.log('propertyCreate error  :', error);
            }
        });
    }
    addRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomData = req.body;
                const userId = req.userId;
                roomData.propertyId = userId;
                const isEdit = false;
                const Res = yield this.usercase.add_edit_Room(roomData, isEdit);
                res.json(Res);
            }
            catch (error) {
            }
        });
    }
    editRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomData = req.body;
                const userId = req.userId;
                roomData.propertyId = userId;
                const isEdit = true;
                const Res = yield this.usercase.add_edit_Room(roomData, isEdit);
                res.json(Res);
            }
            catch (error) {
            }
        });
    }
    deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomId = req.query.roomId;
                const propertyId = req.userId;
                const Res = yield this.usercase.deleteRoom(roomId);
                if (Res.deletedCount > 0) {
                    const rooms = yield this.usercase.fetchRoomData(propertyId);
                    if (rooms) {
                        console.log('rooms :', rooms);
                        res.json({ success: true, message: 'Room Deleted successfully..!', rooms });
                    }
                    else {
                        res.json({ success: true, message: 'Room Deleted successfully..!' });
                    }
                }
                else {
                    res.json({ success: false, message: 'Room deleting failed..!' });
                }
            }
            catch (error) {
            }
        });
    }
    fetchRoomData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const Res = yield this.usercase.fetchRoomData(userId);
                res.json(Res);
            }
            catch (error) {
            }
        });
    }
    fetchOtherProfileRoomData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.query;
                const userId = profileId;
                const Res = yield this.usercase.fetchRoomData(userId);
                res.json(Res);
            }
            catch (error) {
            }
        });
    }
}
exports.default = propertyController;
