        import mongoose, {Schema} from "mongoose"
        import { followSchemaInterface, followerData, followingData } from "../../domain_entities/follow"

        const FollowingDataSchema  = new Schema<followingData>({
            followingID:{type:String},
            follwingDate:{type:Date,default: Date.now()},
            isAccepted:{type:Boolean,default:false},
            isProperty:{type:Boolean}
        })
        const FollowerDataSchema  = new Schema<followerData>({
            followerID:{type:String},
            follwingDate:{type:Date,default: Date.now()},
            isAccepted:{type:Boolean,default:false},
            isProperty:{type:Boolean}

        })

        const followSchema = new Schema<followSchemaInterface>({
                userId:{type:String},
                following:[FollowingDataSchema ],
                follower:[FollowerDataSchema ]
        })

        const followModel = mongoose.model<followSchemaInterface>('Follower',followSchema)
        export default followModel