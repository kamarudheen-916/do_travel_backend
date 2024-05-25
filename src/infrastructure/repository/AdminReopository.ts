import { bookingData } from "../../domain_entities/BookingData";
import { PostReport } from "../../domain_entities/PostReport";
import IAdminRepository from "../../useCase/interface/IAdminRepository";
import bookingModel from "../database/BookingModel";
import { PostModel } from "../database/PostModel";
import PostReportModel from "../database/PostReportModel";
import DeletedPostModel  from "../database/deletedPost";

import PropertyModel from "../database/propertyModel";
import { UserModel } from "../database/userModel";

class AdminRepository implements IAdminRepository {
    async findCountOfProperties(): Promise<any> {
        try {
            const count = (await PropertyModel.find()).length
            return count
        } catch (error) {
            console.log('find count of properties :',error);
        }
    }

    async  findCountOfUser(): Promise<any> {
        try {
            const count = (await UserModel.find()).length
            return count
        } catch (error) {
            console.log('find count of properties :',error);
        }
    }

    async  findCountOfBookings(): Promise<any> {
        try {
            const count = (await bookingModel.find()).length
            return count
        } catch (error) {
            console.log('find count of properties :',error);
        }
    }
   async fetchDashBoardGraphData(DataType:string,matchCondition:any): Promise<any> {
        try {
            console.log(DataType,matchCondition);
            
            let data
            if(DataType === 'users'){
             const users = await UserModel.find(matchCondition).exec()
             if(users){
                data = users.map((item)=>(item.createdAt))
             }
            }else if(DataType === 'Properties'){
             const properties  = await PropertyModel.find(matchCondition).exec()
             if(properties){
                data = properties.map(item => item.createdAt)
             }
            }else if(DataType === 'bookings'){
             const Bookings = await bookingModel.find(matchCondition).exec()
             if(Bookings){
                data = Bookings.map(item => item.createdAt)
             }
            }
            return data
        } catch (error) {
            console.log('fetch dash board graph data error :',error);
            
        }
    }
    async fetchAllUserData(userType:string): Promise<any> {
        try {
            if(userType === 'user'){
                const data = await UserModel.find()
                if(data){
                    return {success:true,data}
                }else {
                    return {success:false,data:[]}
                }
            }else if(userType === 'property'){
                const data = await PropertyModel.find()
                if(data){
                    return {success:true,data}
                }else {
                    return {success:false,data:[]}
                }
            }
        } catch (error) {
         console.log('fetchAllUserData error in admin repository');
            
        }
    }
    async handleBlockOrUnblock(userId: string, userType: string): Promise<any> {
        try {
            if(userType==='user'){

                const user = await UserModel.findOne({_id:userId})                
                if(user){
                    user.isBlocked = !user.isBlocked
                    user.save()
                    return {success:true,message:'Blocking Status updated..!'}
                }else{
                    return {success:false,message:'cannot find the user..!'}

                }
            }else{
                const property = await PropertyModel.findOne({_id:userId})
                if(property){
                    property.isBlocked = !property.isBlocked
                    property.save()
                    return {success:true,message:'Blocking Status updated..!'}
                }else{
                    return {success:false,message:'cannot find the porperty..!'}
                }
            }
        } catch (error) {
            console.log('handle Block or un block error :',error);
            
        }
    }

    async fetchAllBookingData(): Promise<any> {
        try {
            const bookings:bookingData[] = await bookingModel.find()
            if(bookings){
                 await Promise.all(( bookings.map(async (item,index)=>{
                    const property = await PropertyModel.findOne({_id:item.propertyId})
                    bookings[index].propertyName = property?.PropertyName
                    bookings[index].propertyProfile = property?.PropertyProfile
                })))
                return {success:true,bookings}
            }else{
                return {success:false,message:'oops..! no bookings..',bookings:[]}
            }
        } catch (error) {
            console.log('fetch all booking data :',error);
            
        }
    }

    async fetchAllPostReportData(): Promise<any> {
        try {
            const allReports = await PostReportModel.find();
            if (allReports) {
                const updatedReports = await Promise.all(allReports.map(async (item) => {
                    let reporterName = '';
                    if (item.reporterType === 'user') {
                        const user = await UserModel.findOne({ _id: item.reporterId });
                        if(user){
                            reporterName = user.firstName ;

                        }
                    } else {
                        const property = await PropertyModel.findOne({ _id: item.reporterId });
                        if(property){
                            reporterName = property.PropertyName 
                        }
                    }
                    console.log('reporterName:',reporterName);
                    
                    return {
                        ...item.toObject(),  // Convert MongoDB document to plain JavaScript object
                        reporterName
                    };
                }));
    
                // console.log(updatedReports);
                return { success: true, data: updatedReports };
            } else {
                return { success: false, message: 'Oops..! no reports found.', data: [] };
            }
        } catch (error) {
            console.log('fetch all post report data:', error);
            return { success: false, message: 'Error fetching post report data.', data: [] };
        }
    }

    async findUserPostById(postId:string,isDeleted:string): Promise<any> {
        try {   
            console.log('it is deleted post +++++> ',postId,isDeleted);

            let post 
           if(isDeleted === 'false'){
            console.log('it is deleted post**** ');

            post = await PostModel.findOne({_id:postId})
           }else if(isDeleted === 'true'){  
            post = await DeletedPostModel.findOne({_id:postId})
            console.log('it is deleted post -----');
           }
           if(post){
            return {success:true,data:post}
           }else{
            return {success:false,message:'cannot find the post'}
           }
        } catch (error) {
            console.log('findUserPostById error :',error);
        }
    }

    async deletePost(postId: any): Promise<any> {
        try {
            const post = await PostModel.findByIdAndDelete(postId)
            const updateRes =  await PostReportModel.updateOne({postId},{$set:{status:'Deleted'}}) 
            console.log('update Res :',updateRes);
            
            if(post){
                const res = await DeletedPostModel.insertMany([post])
                if(res){
                   return {success:true,message:'Successfully post deleted '}
                }else{
                    return {success:false,message:' Post deletion failed '}
                }
            }
            
          
        } catch (error) {
            console.log('deletePost error in post repository :',error);
            return {success:false,message:'cannot delete the post '}
        }
    }
    
}
export default AdminRepository