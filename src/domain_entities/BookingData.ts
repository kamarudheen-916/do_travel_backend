
export interface bookingData {
    id?:string
    roomId:string
    roomName:string
    roomType:string
    propertyName:string
    propertyProfile:string
    propertyId:string
    bookingUserId:string
    First_Name:string
    Second_Name:string
    Email:string
    Nationality:string
    checkInDate:string
    checkOutDate:string
    images:string[]
    food:string[]
    facilities:string[]
    numberOfRoom:number
    Mobile:number
    numberOfAdults:number
    numberOfChilden:number
    totalPrice:number
    numberDays:number
    isCancellationfree:boolean
    isBeforePayment:boolean
    paymentIsOnline:boolean
    bookingStatus:string
    location:string
}