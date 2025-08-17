"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BookingUseCase {
    constructor(iBookingRepository) {
        this.iBookingRepository = iBookingRepository;
    }
    async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
        try {
            const res = await this.iBookingRepository.checkRoomAvailability(roomId, checkInDate, checkOutDate);
            return res;
        }
        catch (error) {
            console.log('confirm booking error in booking usecase : ', error);
        }
    }
    async confirmBooking(BookingData) {
        try {
            const res = await this.iBookingRepository.uploadBookingData(BookingData);
            return res;
        }
        catch (error) {
            console.log('confirm booking error in booking usecase : ', error);
        }
    }
    async onlinePayment(bookingData, roomPrice) {
        try {
            const res = await this.iBookingRepository.onlinePayment(bookingData, roomPrice);
            return res;
        }
        catch (error) {
            console.log('confirm booking error in booking usecase : ', error);
        }
    }
    async fetchAllBookings(UserId) {
        try {
            const res = await this.iBookingRepository.fetchAllBookings(UserId);
            return res;
        }
        catch (error) {
            console.log('confirm booking error in booking usecase : ', error);
        }
    }
    async cancelBookings(BookingId) {
        try {
            const res = await this.iBookingRepository.cancelBookings(BookingId);
            return res;
        }
        catch (error) {
            console.log('confirm booking error in booking usecase : ', error);
        }
    }
}
exports.default = BookingUseCase;
