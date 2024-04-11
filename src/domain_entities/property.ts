interface Property {
            id?:string,
            PropertyName: string,
            email: string,
            password: string,
            isBlocked:false,
            startedDate: Date,
            Address:string,
            TypeOfStay:string[],
            Speciality:string[],
            MobileNumber:string,
            license:string , 
            PropertyProfile: string,
            IsVerified:boolean,
            OTP:string,
}
export default Property