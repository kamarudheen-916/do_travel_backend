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
const BookingModel_1 = __importDefault(require("../database/BookingModel"));
const stripe_1 = __importDefault(require("stripe"));
const propertyRoom_1 = __importDefault(require("../database/propertyRoom"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
}
const stripe = new stripe_1.default(stripeSecretKey);
class BookingRepository {
    checkRoomAvailability(roomId, checkInDate, checkOutDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomData = yield propertyRoom_1.default.findById(roomId);
                console.log('check room availability :', roomId);
                if (roomData && roomData.bookedDates.length > 0) {
                    const checkIn = new Date(checkInDate);
                    const checkOut = new Date(checkOutDate);
                    for (const booking of roomData.bookedDates) {
                        const bookedCheckIn = new Date(booking.checkInDate);
                        const bookedCheckOut = new Date(booking.checkOutDate);
                        if ((checkIn >= bookedCheckIn && checkIn < bookedCheckOut) ||
                            (checkOut > bookedCheckIn && checkOut <= bookedCheckOut) ||
                            (checkIn <= bookedCheckIn && checkOut >= bookedCheckOut)) {
                            return { success: false, message: 'Room is not available for the given dates' };
                        }
                    }
                    return { success: true, message: 'Room is available' };
                }
                else {
                    return { success: true, message: 'Room is available' };
                }
            }
            catch (error) {
                console.log('check room availability error at Booking repository:', error);
                return { success: false, message: 'An error occurred while checking room availability' };
            }
        });
    }
    uploadBookingData(BookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield BookingModel_1.default.insertMany([BookingData]);
                const roomData = yield propertyRoom_1.default.findOne({ _id: BookingData.roomId });
                if (roomData) {
                    console.log('room data :', roomData);
                    roomData.bookedDates.push({ checkInDate: BookingData.checkInDate, checkOutDate: BookingData.checkOutDate, bookedRoomCount: BookingData.numberOfRoom });
                    // roomData.numOfRoomLeft =  roomData.numOfRoomLeft - BookingData.numberOfRoom
                    roomData.save();
                }
                if (res)
                    return { success: true };
                else
                    return { success: false };
            }
            catch (error) {
                console.log('confirm booking error in Booking repository', error);
            }
        });
    }
    fetchAllBookings(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (UserId) {
                    const doc = yield BookingModel_1.default.find({ bookingUserId: UserId });
                    if (doc) {
                        console.log(doc);
                        return { success: true, message: 'fetching all bookings successfull', bookingData: doc };
                    }
                    else {
                        return { success: false, message: 'fetching all bookings failed..!' };
                    }
                }
                else {
                    return { success: false, message: 'fetching all bookings failed..!' };
                }
            }
            catch (error) {
                console.log('confirm booking error in Booking repository', error);
                return { success: false, message: 'fetching all bookings failed..!' };
            }
        });
    }
    cancelBookings(BookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield BookingModel_1.default.updateOne({ _id: BookingId }, { $set: { bookingStatus: 'cancelled' } });
                if (res.modifiedCount > 0) {
                    return { success: true, message: 'You booking cancellation is successful' };
                }
                else {
                    return { success: false, message: 'cancel  booking failed..!' };
                }
            }
            catch (error) {
                console.log('cancell booking error in Booking repository', error);
                return { success: false, message: 'cancel  booking failed..!' };
            }
        });
    }
    onlinePayment(bookingData, roomPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('stripe secret key :', stripeSecretKey);
                const items = {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: bookingData.roomName,
                            images: bookingData.images
                        },
                        unit_amount: Math.round(roomPrice * 100)
                    },
                    quantity: bookingData.numberOfRoom
                };
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [items],
                    mode: 'payment',
                    success_url: 'http://localhost:5173/paymentSuccess',
                    cancel_url: 'http://localhost:5173/paymentCancell'
                });
                if (session) {
                    return { success: true, session };
                }
                else {
                    return { success: false, message: 'Payment session creation failed form backend..!' };
                }
            }
            catch (error) {
                console.log('online payment  error in Booking repository', error);
                return { success: false, message: 'online payment   failed..!' };
            }
        });
    }
}
exports.default = BookingRepository;
