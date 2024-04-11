import { JwtPayload } from "jsonwebtoken";

interface IJwtTocken {
    createJWT(userId:string,role:string):string,
    verifyJWT(token:string):JwtPayload|null
}

export default IJwtTocken