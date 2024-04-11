import Property from "../../domain_entities/property";
import User from "../../domain_entities/user";


interface IuserRepository {
    findByEmail(email:string,userType:string):Promise<User|Property|null>
    saveUser(user:User|Property,userType:string):Promise<User|Property|null>
    
}

export default IuserRepository