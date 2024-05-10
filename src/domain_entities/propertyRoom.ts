export interface Rooms{
    _id?:string,
    propertyId:string,
    roomName:string,
    typeOfRoom:string,
    rating:Number,
    location:string,
    facilities:string[],
    revews:string[],
    price:number,
    numOfnights:number,
    numOfAdults:number,
    numOfRoomLeft:number;
    freeCancellation:boolean,
    isBeforePayment:boolean,
    images:string[]
}