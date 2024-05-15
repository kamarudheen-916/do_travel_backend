import { bookingData } from "../domain_entities/BookingData";
import IBookingRepository from "./interface/IBookingRepository";

class BookingUseCase {
    constructor(private readonly iBookingRepository:IBookingRepository){}
    async  confirmBooking (BookingData : bookingData){
        try {
            const res = await this.iBookingRepository.uploadBookingData(BookingData)
            return res
        } catch (error) {
            console.log('confirm booking error in booking usecase : ',error);
            
        }
    }
    async  fetchAllBookings (UserId : any){
        try {
            const res = await this.iBookingRepository.fetchAllBookings(UserId)
            return res
        } catch (error) {
            console.log('confirm booking error in booking usecase : ',error);
            
        }
    }
    async  cancelBookings (BookingId : any){
        try {
            const res = await this.iBookingRepository.cancelBookings(BookingId)
            return res
        } catch (error) {
            console.log('confirm booking error in booking usecase : ',error);
            
        }
    }
}

export default BookingUseCase