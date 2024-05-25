import IAdminRepository from "./interface/IAdminRepository";
import IJwtTocken from "./interface/IjwtToken";

export interface adminFormData {
    adminName:'',
    password:'',
}

class AdminUseCase {
    constructor(
        private readonly iAdminRepository:IAdminRepository,
        private readonly jwt : IJwtTocken,
    ){}
    async adminLogin(loginData:adminFormData){
        try {
            const adminName:string = 'Admin@123'
            const password:string = 'Admin@123'
            if((loginData.adminName == adminName) &&( loginData.password === password)){
                const JWT_KEY = process.env.JWT_KEY
                if(JWT_KEY){   
                    const token = this.jwt.createJWT('123456789'as string,'admin')
                    return {success:true,message:'successfully admin loged in...!',token,user:'admin'}
                }
            }else{
                return {success:false,message:'admin loged in failed..!'}
            }
        } catch (error) {
            console.log('admin login error :',error);
            return {success:false,message:'admin loged in failed..!'}
            
        }
    }
    async fetchDashBoardCount(){
      try {
        const numberUsers = await this.iAdminRepository.findCountOfUser()
        const numberProperties = await this.iAdminRepository.findCountOfProperties()
        const numberBooking = await this.iAdminRepository.findCountOfBookings()
        if(numberProperties&&numberUsers){
            return {success:true,numberProperties,numberUsers,numberBooking}
        }else{
            return {success:false,message:'cannot fetch the data ...!'}
        }
        
      } catch (error) {
        console.log('fetch dash board data : ',error);
        
        return {success:false,message:'cannot fetch the data ...!'}
        
      }
    }



    async fetchDashBoardGraphData(DataType: any, DateType: any) {
        try {
          console.log(DataType, DateType);
      
          const today = new Date();
          let matchCondition;
      
          switch (DateType) {
            case 'year':
              matchCondition = {
                $expr: {
                  $and: [
                    { $eq: [{ $year: '$createdAt' }, today.getFullYear()] },
                    { $eq: [{ $month: '$createdAt' }, today.getMonth() + 1] },
                    { $eq: [{ $dayOfMonth: '$createdAt' }, today.getDate()] },
                  ],
                },
              };
              break;
            case 'day':
              matchCondition = {
                $expr: {
                  $and: [
                    { $eq: [{ $year: '$createdAt' }, today.getFullYear()] },
                    { $eq: [{ $month: '$createdAt' }, today.getMonth() + 1] },
                  ],
                },
              };
              break;
            case 'month':
              matchCondition = {
                $expr: {
                  $eq: [{ $year: '$createdAt' }, today.getFullYear()],
                },
              };
              break;
            case 'all':
              matchCondition = {};
              break;
            default:
              return { success: false, message: 'Invalid DateType provided' };
          }
      
          const datas = await this.iAdminRepository.fetchDashBoardGraphData(DataType, matchCondition);
          let originalData;
          console.log('datas :',datas);
          
          if (DateType === 'day') {
            const od = datas.map((item: string) => new Date(item).getDate().toString());
            let fullData: { [key: string]: number } = {};
      
            od.forEach((item: string) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
      
            const data = Object.keys(fullData).map(key => ({
              name: `Day ${key}`,
              count: fullData[key],
            }));
      
            console.log(data);
            originalData = data;
      
          } else if (DateType === 'month') {
            const od = datas.map((item: string) => new Date(item).toLocaleString('default', { month: 'short' }));
            let fullData: { [key: string]: number } = {};
      
            od.forEach((item: string) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
      
            const data = Object.keys(fullData).map(key => ({
              name: key,
              count: fullData[key],
            }));
      
            console.log(data);
            originalData = data;
      
          } else if (DateType === 'year') {
            const od = datas.map((item: string) => new Date(item).getFullYear().toString());
            let fullData: { [key: string]: number } = {};
      
            od.forEach((item: string) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
      
            const data = Object.keys(fullData).map(key => ({
              name: key,
              count: fullData[key],
            }));
      
            console.log(data);
            originalData = data;
      
          } else if (DateType === 'all') {
            const od = datas.map((item: string) => new Date(item).getFullYear().toString());
            let fullData: { [key: string]: number } = {};
      
            od.forEach((item: string) => fullData[item] ? fullData[item] = fullData[item] + 1 : fullData[item] = 1);
      
            const data = Object.keys(fullData).map(key => ({
              name: key,
              count: fullData[key],
            }));
      
            console.log(data);
            originalData = data;
          }
      
          return { success: true, data: originalData };
        } catch (error) {
          console.log('fetch dashboard graph data:', error);
          return { success: false, message: 'Cannot fetch the data ...!' };
        }
      }

      async fetchAllUserData(userType:any){
        try {
            const data = await this.iAdminRepository.fetchAllUserData(userType)
            return data
        } catch (error) {
          console.log('fetchAllUserData error : ',error);
          
          return {success:false,message:'cannot fetch the data ...!'}
          
        }
      }
      
      async handleBlockOrUnblock(userId:any,userType:any){
        try {
            const data = await this.iAdminRepository.handleBlockOrUnblock(userId,userType)
            return data
        } catch (error) {
          console.log('fetchAllUserData error : ',error);
          
          return {success:false,message:'cannot fetch the data ...!'}
          
        }
      }

      async fetchAllBookingData(){
        try {
            const data = await this.iAdminRepository.fetchAllBookingData()
            return data
        } catch (error) {
          console.log('fetchAllUserData error : ',error);
          
          return {success:false,message:'cannot fetch the data ...!'}
          
        }
      }
      async fetchAllPostReportData(){
        try {
            const data = await this.iAdminRepository.fetchAllPostReportData()
            return data
        } catch (error) {
          console.log('fetchAllUserData error : ',error);
          
          return {success:false,message:'cannot fetch the data ...!'}
          
        }
      }

      async findUserPostById(postId:any,isDeleted:any){
        try {
            const data = await this.iAdminRepository.findUserPostById(postId,isDeleted)            
            return data
        } catch (error) {
          console.log('fetchAllUserData error : ',error);
          
          return {success:false,message:'cannot fetch the data ...!'}
          
        }
      }

      async deletePost(postId:any){
        try {
            const res = await this.iAdminRepository.deletePost(postId)
            return res
        } catch (error) {
            console.log('isPostLiked error in userUserCase',error);
        }
    }
}

export default AdminUseCase
