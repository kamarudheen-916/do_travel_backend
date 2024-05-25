interface IAdminRepository {
    findCountOfUser():Promise<any>
    findCountOfProperties():Promise<any>
    findCountOfBookings():Promise<any>
    fetchDashBoardGraphData(DataType:string,matchCondition:any):Promise<any>
    fetchAllUserData(userType:string):Promise<any>
    handleBlockOrUnblock(userId:string,userType:string):Promise<any>
    fetchAllBookingData():Promise<any>
    fetchAllPostReportData():Promise<any>
    findUserPostById(postId:string,isDeleted:string):Promise<any>
    deletePost(postId:any):Promise<any>


}
export default IAdminRepository