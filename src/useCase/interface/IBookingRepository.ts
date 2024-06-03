import { bookingData } from "../../domain_entities/BookingData"
import { Rooms } from "../../domain_entities/propertyRoom"

 interface IBookingRepository {
    checkRoomAvailability(roomId:string,checkInDate:string,checkOutDate:string):Promise<any>
    uploadBookingData(BookingData:bookingData):Promise<any>
    onlinePayment(bookingData:bookingData,roomPrice:any):Promise<any>
    fetchAllBookings(UserId:string):Promise<bookingData>
    cancelBookings(BookingId:string):Promise<bookingData>
}
export default IBookingRepository