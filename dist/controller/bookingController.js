"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BookingController {
    constructor(bUseCase) {
        this.bUseCase = bUseCase;
    }
    async checkRoomAvailability(req, res) {
        try {
            console.log('checkRoomAvailability test  :', req.query);
            const { roomId, checkInDate, checkOutDate } = req.query;
            const responce = await this.bUseCase.checkRoomAvailability(roomId, checkInDate, checkOutDate);
            res.json(responce);
        }
        catch (error) {
            console.log('confirm booking error in booking controller :', error);
            res.json('oops, something went wrong...');
        }
    }
    async confirmBooking(req, res) {
        try {
            const bookingData = req.body.bookingData;
            bookingData.bookingUserId = req.userId ? req.userId : '';
            bookingData.bookingStatus = 'confirmed';
            const responce = await this.bUseCase.confirmBooking(bookingData);
            res.json(responce);
        }
        catch (error) {
            console.log('confirm booking error in booking controller :', error);
        }
    }
    async onlinePayment(req, res) {
        try {
            const bookingData = req.body.bookingData;
            const roomPrice = req.body.roomPrice;
            const RES = await this.bUseCase.onlinePayment(bookingData, roomPrice);
            res.json(RES);
        }
        catch (error) {
            console.log('confirm booking error in booking controller :', error);
        }
    }
    async fetchAllBookings(req, res) {
        try {
            const UserId = req.userId;
            const responce = await this.bUseCase.fetchAllBookings(UserId);
            res.json(responce);
        }
        catch (error) {
            console.log('confirm booking error in booking controller :', error);
        }
    }
    async cancelBookings(req, res) {
        try {
            console.log('querty ', req.query);
            const BookingId = req.query.bookingId;
            const RES = await this.bUseCase.cancelBookings(BookingId);
            res.json(RES);
        }
        catch (error) {
            console.log('confirm booking error in booking controller :', error);
        }
    }
}
exports.default = BookingController;
