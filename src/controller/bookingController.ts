import { Request, Response } from "express";
import bookingUseCase from "../useCase/bookingUseCase";
import { bookingData } from "../domain_entities/BookingData";
import { Rooms } from "../domain_entities/propertyRoom";

class BookingController {
    constructor (private readonly bUseCase:bookingUseCase){}

    async confirmBooking (req:Request,res:Response){
        try {
            const bookingData :bookingData = req.body.bookingData
            bookingData.bookingUserId = req.userId ? req.userId : ''
            bookingData.bookingStatus = 'confirmed'
            const responce = await this.bUseCase.confirmBooking(bookingData)
            res.json(responce)
        } catch (error) {
            console.log('confirm booking error in booking controller :',error);
            
        }
    }
    async onlinePayment (req:Request,res:Response){
        try {
            const bookingData :bookingData = req.body.bookingData
            const roomPrice = req.body.roomPrice
            const RES = await this.bUseCase.onlinePayment(bookingData,roomPrice)
            res.json(RES)
        } catch (error) {
            console.log('confirm booking error in booking controller :',error);
            
        }
    }

    async fetchAllBookings (req:Request,res:Response){
        try {
            const UserId = req.userId    
            const responce = await this.bUseCase.fetchAllBookings(UserId)
            
            res.json(responce)
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