
export interface ratingData{
    raterId:string,
    rate:number,
    _id?:string,
    ratedDate:Date, 
    comments:string,
}
export interface  roomBookinDates{
    checkInDate : string,
    checkOutDate : string,
    bookedRoomCount:number
}
export interface Rooms{
    _id?:string,
    propertyId:string,
    roomName:string,
    typeOfRoom:string,
    ratings:[ratingData],
    location:string,
    facilities:string[],
    revews:string[],
    price:number,
    numOfNights:number,
    numOfAdults:number,
    numOfRoomLeft:number;
    freeCancellation:boolean,
    isBeforePayment:boolean,
    images:string[],
    bookedDates:[roomBookinDates]
}