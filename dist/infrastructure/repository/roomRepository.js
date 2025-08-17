"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const propertyRoom_1 = __importDefault(require("../database/propertyRoom"));
class RoomRepository {
    async addOrEditRoom(roomData, isEdit) {
        try {
            console.log(roomData);
            if (!isEdit) {
                const res = await propertyRoom_1.default.insertMany([roomData]);
                if (res) {
                    return { success: true, message: 'Room added successfully..!' };
                }
                else {
                    return { success: false, message: 'Room adding failed..!' };
                }
            }
            else {
                const res = await propertyRoom_1.default.updateOne({ _id: roomData._id }, { $set: roomData });
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
    }
    async fetchRoomData(userId) {
        try {
            const rooms = await propertyRoom_1.default.find({ propertyId: userId });
            return rooms;
        }
        catch (error) {
            console.log('fetch room data in room repository', error);
        }
    }
    async deleteRoom(roomId) {
        try {
            const res = await propertyRoom_1.default.deleteOne({ _id: roomId });
            return res;
        }
        catch (error) {
            console.log('fetch room data in room repository', error);
        }
    }
}
exports.default = RoomRepository;
