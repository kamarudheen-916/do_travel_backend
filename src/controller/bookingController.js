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
class BookingController {
    constructor(bUseCase) {
        this.bUseCase = bUseCase;
    }
    checkRoomAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('checkRoomAvailability test  :', req.query);
                const { roomId, checkInDate, checkOutDate } = req.query;
                const responce = yield this.bUseCase.checkRoomAvailability(roomId, checkInDate, checkOutDate);
                res.json(responce);
            }
            catch (error) {
                console.log('confirm booking error in booking controller :', error);
            }
        });
    }
    confirmBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = req.body.bookingData;
                bookingData.bookingUserId = req.userId ? req.userId : '';
                bookingData.bookingStatus = 'confirmed';
                const responce = yield this.bUseCase.confirmBooking(bookingData);
                res.json(responce);
            }
            catch (error) {
                console.log('confirm booking error in booking controller :', error);
            }
        });
    }
    onlinePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = req.body.bookingData;
                const roomPrice = req.body.roomPrice;
                const RES = yield this.bUseCase.onlinePayment(bookingData, roomPrice);
                res.json(RES);
            }
            catch (error) {
                console.log('confirm booking error in booking controller :', error);
            }
        });
    }
    fetchAllBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const UserId = req.userId;
                const responce = yield this.bUseCase.fetchAllBookings(UserId);
                res.json(responce);
            }
            catch (error) {
                console.log('confirm booking error in booking controller :', error);
            }
        });
    }
    cancelBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('querty ', req.query);
                const BookingId = req.query.bookingId;
                const RES = yield this.bUseCase.cancelBookings(BookingId);
                res.json(RES);
            }
            catch (error) {
                console.log('confirm booking error in booking controller :', error);
            }
        });
    }
}
exports.default = BookingController;
