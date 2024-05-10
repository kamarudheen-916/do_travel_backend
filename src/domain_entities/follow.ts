export interface FollowReq{
    requesterId:string,
    isRequesterProperty:boolean,
    followerId:string,
    isProperty:boolean
}

export interface followingData  {
    followingID:string,
    follwingDate:Date,
    isAccepted:boolean,
    isProperty:boolean
}
export interface followerData {
    followerID: string;
    follwingDate: Date;
    isAccepted: boolean;
    isProperty:boolean
}

export interface followSchemaInterface {
        userId:string,
        following:[followingData],
        follower:[followerData]
}