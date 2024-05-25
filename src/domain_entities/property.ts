interface Property {
            _id?:string,
            PropertyName: string,
            email: string,
            password: string,
            isBlocked:boolean,
            startedDate: Date,
            Address:string,
            TypeOfStay:string[],
            Speciality:string[],
            MobileNumber:string,
            license:string , 
            PropertyProfile: string,
            IsVerified:boolean,
            OTP:string,
            createdAt:Date
}
export default Property