import { FollowReq } from "../../domain_entities/follow";

export interface IFollowRepository{
    sendFollowReqest(data:FollowReq):Promise<any>
    unFollowReqest(data:FollowReq):Promise<any>
    checkIsFollwoed(data:FollowReq):Promise<any>
    getFollwerRequest(userId:string):Promise<any>
    confirmFollReq(followerId:string,userId:string):Promise<any>
    cancelFollReq(followerId:string,userId:string):Promise<any>
    getAllFollwers(userId:string|undefined):Promise<any>
    getFollowRealData(id:string,type:string):Promise<any>
   

}