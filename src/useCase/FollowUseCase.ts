import { FollowReq, followSchemaInterface } from "../domain_entities/follow";
import { IFollowRepository } from "./interface/IFollowRepository";
import IuserRepository from "./interface/IuserRepository";

class FollowUseCase{
    constructor(
        private readonly IfollowRepo : IFollowRepository,
        private readonly IuserRepo : IuserRepository
    ){}

    async FollowRequest(data:FollowReq){
        try {
           
            // const followingType = data.isProperty ? 'property' :'user'
            // const findFollowing = await this.IuserRepo.findUserById(data.followerId,followingType)
            // console.log('findFollowing:',findFollowing);
            
            // if(findFollowing){
            //     const Res = await this.IfollowRepo.sendFollowReqest(data)
            // }
            const Res = await this.IfollowRepo.sendFollowReqest(data)
            return Res
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
    async unFollowRequest(data:FollowReq){
        try {
            const Res = await this.IfollowRepo.unFollowReqest(data)
            return Res
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
    async checkIsFollwoed(data:any){
        try {
           
            const Res = await this.IfollowRepo.checkIsFollwoed(data)
            return Res
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
    async isFollwerRequest(data:any){
        try {
            const Res = await this.IfollowRepo.getFollwerRequest(data.userId)
            return Res
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
    async confirmFollReq({followerId,userId}:{followerId:string,userId:string}){
        try {
            const Res = await this.IfollowRepo.confirmFollReq(followerId,userId)
            return Res
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
    async cancelFollReq({followerId,followingId}:{followerId:string,followingId:string}){
        try {
            const Res = await this.IfollowRepo.cancelFollReq(followerId,followingId)
            return Res
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
    async fetchAllFollowData(userId:any){
        try {
       
            let followingData =[],followerData=[]
            const Res:followSchemaInterface = await this.IfollowRepo.getAllFollwers(userId)
             followingData = Res.following.filter((item)=>item.isAccepted)
             followerData = Res.follower.filter((item)=>item.isAccepted)
            return {followerData:followerData,followingData:followingData}
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
    async fetchFollowerOriginalData(userId:any,isFollowing:any){
        try {      
            const Res:followSchemaInterface = await this.IfollowRepo.getAllFollwers(userId)
            // console.log('========>',Res); 
            let followerData
            if(isFollowing === 'true'){
                followerData = await Promise.all(Res.following.map(async(item)=>{
                   if(item.isAccepted){
                    const id =item.followingID
                    const type = item.isProperty ? 'property':'user'
                    const ResData = await this.IfollowRepo.getFollowRealData(id,type)
                    if(type === 'user'){
                      return  {
                            Profile:ResData.data.Profile,
                            Name : ResData.data.firstName,
                            isProperty:false,
                            id:ResData.data._id
                        }
                    }else{
                        return{
                            Profile:ResData.data.PropertyProfile,
                            Name : ResData.data.PropertyName,
                            isProperty:true,
                            id:ResData.data._id
                        }
                    }
                   }

                }))
            }else if(isFollowing === 'false'){
                followerData = await Promise.all(Res.follower.map(async(item)=>{
                   if(item.isAccepted){
                    const id =item.followerID
                    const type = item.isProperty ? 'property':'user'
                    const ResData = await this.IfollowRepo.getFollowRealData(id,type)
                    console.log('Res Data :',ResData);
                    
                    if(type === 'user'){
                      return  {
                            Profile:ResData.data.Profile,
                            Name : ResData.data.firstName,
                            isProperty:false,
                            id:ResData.data._id
                        }
                    }else{
                        return{
                            Profile:ResData.data.PropertyProfile,
                            Name : ResData.data.PropertyName,
                            isProperty:true,
                            id:ResData.data._id
                        }
                    }
                   }
                }
            ))
            }     
            console.log('follwer data :====>',followerData);
            return {followerData}
        } catch (error) {
            console.log('Followrequest error in Follow user case :',error);
            
        }
    }
}
export default FollowUseCase