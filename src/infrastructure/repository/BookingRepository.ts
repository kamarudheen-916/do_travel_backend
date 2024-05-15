import { bookingData } from "../../domain_entities/BookingData";
import IBookingRepository from "../../useCase/interface/IBookingRepository";
import bookingModel from "../database/BookingModel";


class BookingRepository implements IBookingRepository {
   async uploadBookingData(BookingData: bookingData): Promise<any> {
        try {
            const res = await bookingModel.insertMany([BookingData])
            if(res)
            return {success:true}
            else
            return {success:false}
        } catch (error) {
            console.log('confirm booking error in Booking repository',error);
            
        }
    }
     async fetchAllBookings(UserId: string):Promise<any> {
        try {
            if(UserId){
                const doc = await bookingModel.find({bookingUserId:UserId})
                if(doc){
            console.log(doc);

                    return {success : true, message:'fetching all bookings successfull',bookingData:doc}
                }else{
                    return {success : false, message:'fetching all bookings failed..!'}
                }
            }else{
                return {success : false, message:'fetching all bookings failed..!'}

            }
            
        } catch (error) {
            console.log('confirm booking error in Booking repository',error);
                return {success : false, message:'fetching all bookings failed..!'}
        }
    }

   async cancelBookings(BookingId: string): Promise<any> {
        try {
            
            const res = await bookingModel.updateOne({_id:BookingId},{$set:{bookingStatus:'cancelled'}})            
            if(res.modifiedCount > 0){
              return {success : true, message:'You booking cancellation is successful'}
            }else{
               return {success : false, message:'cancel  booking failed..!'}

            }
        } catch (error) {
            console.log('cancell booking error in Booking repository',error);
            return {success : false, message:'cancel  booking failed..!'}
        }
    }
}

export default BookingRepository