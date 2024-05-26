import { bookingData } from "../../domain_entities/BookingData";
import { Rooms } from "../../domain_entities/propertyRoom";
import IBookingRepository from "../../useCase/interface/IBookingRepository";
import bookingModel from "../database/BookingModel";
import Stripe from "stripe";
import RoomModel from "../database/propertyRoom";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}
const stripe = new Stripe(stripeSecretKey);

class BookingRepository implements IBookingRepository {
   async uploadBookingData(BookingData: bookingData): Promise<any> {
        try {
            const res = await bookingModel.insertMany([BookingData])
            const roomData = await RoomModel.findOne({_id:BookingData.roomId})
            if(roomData){
                console.log('room data :',roomData);
                
                roomData.numOfRoomLeft =  roomData.numOfRoomLeft - BookingData.numberOfRoom
                roomData.save()
            }
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

   async onlinePayment(bookingData: bookingData,roomPrice:any): Promise<any> {
        try {
            
            console.log('stripe secret key :',stripeSecretKey); 
            
            const items:any ={
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:bookingData.roomName,
                        images:bookingData.images
                    },
                    unit_amount:Math.round(roomPrice*100)
                },
                quantity:bookingData.numberOfRoom
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types:['card'],
                line_items:[items],
                mode:'payment',
                success_url:'http://localhost:5173/paymentSuccess',
                cancel_url:'http://localhost:5173/paymentCancell'

            })
            if(session){
                return {success:true,session}
            }else{
                return {success:false,message:'Payment session creation failed form backend..!'}
            }
        } catch (error) {
            console.log('online payment  error in Booking repository',error);
            return {success : false, message:'online payment   failed..!'}
        }
    }
}

export default BookingRepository