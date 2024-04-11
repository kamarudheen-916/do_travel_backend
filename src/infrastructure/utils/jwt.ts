import jwt,{JwtPayload} from 'jsonwebtoken'
import IJwtTocken from '../../useCase/interface/IjwtToken'

class JwtTocken implements IJwtTocken{

    createJWT(userId:string,role:string):string{
        const JWTkey = process.env.JWT_KEY
        if(JWTkey){
            const Tocken:string = jwt.sign({id:userId,role:role},JWTkey)
            return Tocken
        }
        throw new Error('JWT Tocken is not defined..!')
    }
    
    verifyJWT(token: string): JwtPayload | null {
        try {
            console.log('verify jwt');
            const JWTkey = process.env.JWT_KEY as string
            const decode = jwt.verify(token,JWTkey) as JwtPayload
            console.log('decode ',decode);
            return decode
            
        } catch (error) {
            console.log('verifyJWT error : ',error);
            return null
        }
    }
}

export default JwtTocken