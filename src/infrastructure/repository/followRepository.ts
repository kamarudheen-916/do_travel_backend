import { FollowReq, followSchemaInterface, followerData, followingData } from "../../domain_entities/follow";
import { IFollowRepository } from "../../useCase/interface/IFollowRepository";
import followModel from "../database/followModel";
import PropertyModel from "../database/propertyModel";
import { UserModel } from "../database/userModel";

class FollowRepository implements IFollowRepository {

  async sendFollowReqest({requesterId,isRequesterProperty,followerId,isProperty,}: FollowReq): Promise<any> {
    try {
      console.log('isProperty:',isProperty);
      const data: followerData = {
        followerID: requesterId,
        follwingDate: new Date(),
        isAccepted: false,
        isProperty: isRequesterProperty,
      };
      const followingData: followingData = {
        followingID: followerId,
        follwingDate: new Date(),
        isAccepted: false,
        isProperty: isProperty,
      };
      const followingDoc = await followModel.findOne({ userId: followerId });
      const requesterDoc = await followModel.findOne({userId:requesterId})
      if (followingDoc) {
        // const isAlreadyRequested = followingDoc.follower.some(
        //   (item) => item.followerID === requesterId
        // );
        // if (isAlreadyRequested) {
        //   return { success: false, message: "Already following" };
        // }
        followingDoc.follower.push(data);
        await followingDoc.save();
      } else {
        await followModel.create({
          userId: followerId,
          follower: [data],
        });
      }
      if(requesterDoc){
        requesterDoc.following.push(followingData)
        await requesterDoc.save()
      }else{
        await followModel.create({
          userId:requesterId,
          following:[followingData]
        })
      }
      return { success: true };
    } catch (error) {
      console.error("Error sending follow request:", error);
      return { success: false, error };
    }
  }
 async unFollowReqest({requesterId,followerId,isProperty,}: FollowReq): Promise<any> {
  try {
    const doc = await followModel.findOne({ userId: followerId });
    if(doc){
      const following_data = doc.following.filter((item)=>{
        return item.followingID === requesterId
      })
      const findIndex = doc.following.indexOf(following_data[0])
      doc.following.splice(findIndex,1)
      doc.save()
      return {success:true,message:'unfollow success'}
    }else{
      return {success:false,message:'unfollow failed'}
    }
  } catch (error) {
    console.log('Error unfollow request :',error );
    return {success:false,error}
  }  
  }



  async checkIsFollwoed({
    requesterId,
    followerId,
    isProperty,
  }: FollowReq): Promise<any> {
    try {
      const doc = await followModel.findOne({ userId: followerId });
      console.log('isAlreadyRequested doc:',doc);

      if (!doc || doc.follower.length < 1) {
        return { success: false };
      }
      const isAlreadyRequested = doc.follower.filter(
        (item) => item.followerID === requesterId
      );
      console.log('isAlreadyRequested:',isAlreadyRequested);
      
      if (isAlreadyRequested && isAlreadyRequested.length > 0) {
  
        // const isAccepted = doc.following.some((item)=>item.isAccepted)
        return { success: true,isAccepted:isAlreadyRequested[0]?.isAccepted };
      }else{
        return {success:false}
      }
    } catch (error) {
      console.error("Error checkIsFollwoed:", error);
      return { success: false, error };
    }
  }
  async getFollwerRequest(userId: string): Promise<any> {
    try {
      const doc = await followModel.findOne({ userId: userId });
      if (doc) {
        const filteredFollowReqData = doc.follower.filter(
          (item) => !item.isAccepted
        );
        let followReqData = await Promise.all(
          filteredFollowReqData.map(async (item) => {
            if (!item.isProperty) {
              const data = await UserModel.findOne(
                { _id: item.followerID },
                { _id: 0, firstName: 1, Profile: 1 }
              ).lean();
              return {
                notificationProfile: data?.Profile,
                notificationName: data?.firstName,
                isProperty: item.isProperty,
                followingId: item.followerID,
              };
            } else {
              const data = await PropertyModel.findOne(
                { _id: item.followerID },
                { _id: 0, PropertyName: 1, PropertyProfile: 1 }
              ).lean();
              return {
                notificationProfile: data?.PropertyProfile,
                notificationName: data?.PropertyName,
                isProperty: item.isProperty,
                followingId: item.followerID,
              };
            }
          })
        );
        return followReqData;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error checkIsFollwoed:", error);
      return { success: false, error };
    }
  }
 async confirmFollReq(followerId: string, userId: string): Promise<any> {
      try {
        const doc = await followModel.updateOne(
            { userId, "follower.followerID": followerId }, 
            { $set: { "follower.$.isAccepted": true } } 
        );
        const res = await followModel.updateOne(
          {userId:followerId,"following.followingID":userId},
          {$set: {"following.$.isAccepted":true}}
      );
      
        if (doc.modifiedCount !== undefined && doc.modifiedCount > 0 && res.modifiedCount !== undefined && res.modifiedCount > 0) {
          console.log('confirm follow request');
          
            return {success:true,message:'follow req confirmed'}
        } else {
            console.log(`Follow request not found for followerId: ${followerId}`);
            return {success:false,message:'follow req confirmed issues is there..!'}

        }
        
      } catch (error) {
        console.error("Error confirmFollReq:", error);
      return { success: false, error };
      }
  }

  async cancelFollReq(followerId:string,followingId:string): Promise<any> {
    try {
      const followerData = await followModel.findOne({userId:followerId})
      if(followerData){
        
        const docIndex = followerData.following.findIndex((item)=>item.followingID === followingId)
        followerData.following.splice(docIndex,1)
  
        followerData.save()        
      }else{
        return   {success:false,message:' cancell request failed..!'}
      }
      const followingData = await followModel.findOne({userId:followingId})
      if(followingData){
        
        const docIndex = followingData.follower.findIndex((item)=>item.followerID === followerId)
        followingData.follower.splice(docIndex,1)
       
        followingData.save()
      }else{
        return   {success:false,message:' cancell request failed..!'}
      }
      return {success:true,message:'successfully cancell request cancelled..!'}
    } catch (error) {
      console.error("Error cancelFollReq:", error);
    return { success: false, error };
    }
}
async getAllFollwers(userId: string | undefined): Promise<followSchemaInterface | {} | null> {
  try {

      const Res = await followModel.findOne({ userId });
      
      return Res !== null ? Res : [];
  } catch (error) {
      console.error("Error getAllFollwers:", error);
      return null;
  }
}

async getFollowRealData(id: string, type: string): Promise<any> {
    try {
      console.log(id,type);
      
      let follData
      if(type === 'user'){
        follData = await UserModel.findOne({_id:id})
      }else{
        follData = await PropertyModel.findOne({_id:id})
      }
      if(follData){
        return {success:true,data:follData}
      }else{
        return {success:false,message:'fetch follower or following data error',data:[]}
      }
    } catch (error) {
        console.log('get followers real data error :',error);
        return {success:false,message:'fetch follower or following data error'}
        
    }
}
}

export default FollowRepository;
