import { Request, Response } from "express";
import bookingUseCase from "../useCase/bookingUseCase";
import { bookingData } from "../domain_entities/BookingData";

class BookingController {
    constructor (private readonly bUseCase:bookingUseCase){}

    async confirmBooking (req:Request,res:Response){
        try {
            const bookingData :bookingData = req.body.bookingData
            bookingData.bookingUserId = req.userId ? req.userId : ''
            bookingData.bookingStatus = 'confirmed'
            const RES = await this.bUseCase.confirmBooking(bookingData)
            res.json(RES)
        } catch (error) {
            console.log('confirm booking error in booking controller :',error);
            
        }
    }

    async fetchAllBookings (req:Request,res:Response){
        try {
            const UserId = req.userId    
            const RES = await this.bUseCase.fetchAllBookings(UserId)
            
            res.json(RES)
        } catch (error) {
            console.log('confirm booking error in booking controller :',error);
            
        }
    }
    async cancelBookings (req:Request,res:Response){
        try {
            console.log('querty ',req.query);
            
            const BookingId = req.query.bookingId    
            const RES = await this.bUseCase.cancelBookings(BookingId)
            
            res.json(RES)
        } catch (error) {
            console.log('confirm booking error in booking controller :',error);
            
        }
    }
}

export default BookingController