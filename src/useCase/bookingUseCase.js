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
class BookingUseCase {
    constructor(iBookingRepository) {
        this.iBookingRepository = iBookingRepository;
    }
    checkRoomAvailability(roomId, checkInDate, checkOutDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iBookingRepository.checkRoomAvailability(roomId, checkInDate, checkOutDate);
                return res;
            }
            catch (error) {
                console.log('confirm booking error in booking usecase : ', error);
            }
        });
    }
    confirmBooking(BookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iBookingRepository.uploadBookingData(BookingData);
                return res;
            }
            catch (error) {
                console.log('confirm booking error in booking usecase : ', error);
            }
        });
    }
    onlinePayment(bookingData, roomPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iBookingRepository.onlinePayment(bookingData, roomPrice);
                return res;
            }
            catch (error) {
                console.log('confirm booking error in booking usecase : ', error);
            }
        });
    }
    fetchAllBookings(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iBookingRepository.fetchAllBookings(UserId);
                return res;
            }
            catch (error) {
                console.log('confirm booking error in booking usecase : ', error);
            }
        });
    }
    cancelBookings(BookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iBookingRepository.cancelBookings(BookingId);
                return res;
            }
            catch (error) {
                console.log('confirm booking error in booking usecase : ', error);
            }
        });
    }
}
exports.default = BookingUseCase;
