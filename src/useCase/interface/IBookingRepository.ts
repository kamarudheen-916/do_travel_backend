import { bookingData } from "../../domain_entities/BookingData"

 interface IBookingRepository {
    uploadBookingData(BookingData:bookingData):Promise<any>
    fetchAllBookings(UserId:string):Promise<bookingData>
    cancelBookings(BookingId:string):Promise<bookingData>
}
export default IBookingRepository