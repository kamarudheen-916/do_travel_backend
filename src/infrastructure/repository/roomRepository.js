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
const propertyRoom_1 = __importDefault(require("../database/propertyRoom"));
class RoomRepository {
    addOrEditRoom(roomData, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(roomData);
                if (!isEdit) {
                    const res = yield propertyRoom_1.default.insertMany([roomData]);
                    if (res) {
                        return { success: true, message: 'Room added successfully..!' };
                    }
                    else {
                        return { success: false, message: 'Room adding failed..!' };
                    }
                }
                else {
                    const res = yield propertyRoom_1.default.updateOne({ _id: roomData._id }, { $set: roomData });
                    console.log('add or edit room reached', res);
                    if (res) {
                        return { success: true, message: 'Room edited successfully..!' };
                    }
                    else {
                        return { success: false, message: 'Room editing failed..!' };
                    }
                }
            }
            catch (error) {
                console.log('add room error in room repository:', error);
                throw error;
            }
        });
    }
    fetchRoomData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield propertyRoom_1.default.find({ propertyId: userId });
                return rooms;
            }
            catch (error) {
                console.log('fetch room data in room repository', error);
            }
        });
    }
    deleteRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield propertyRoom_1.default.deleteOne({ _id: roomId });
                return res;
            }
            catch (error) {
                console.log('fetch room data in room repository', error);
            }
        });
    }
}
exports.default = RoomRepository;
