interface User {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword:string;
    isBlocked: boolean,
    gender:string,
    DOB: Date,
    Country:string,
    State:string,
    MobileNumber:string,
    City:string,
    favoritePlace:string[];
    Profile:string;
    IsVerified:boolean;
    OTP:string;
    createdAt:Date
}
export default User