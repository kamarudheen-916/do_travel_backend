import { Request, Response } from "express";
import AdminUseCase from "../useCase/adminUseCase";
import UserUseCase from "../useCase/UserUseCase";

class AdminController{
    constructor(
        private readonly adminUserCase : AdminUseCase,
        private readonly userCase : UserUseCase
    ){}

    async adminLogin(req:Request,res:Response){
        try {
            const loginData = req.body
            const Res = await this.adminUserCase.adminLogin(loginData)
            res.json(Res)
        } catch (error) {
            console.log('admin login error in admin controller :',error);
        }
    }
    async fetchDashBoardCount(req:Request,res:Response){
        try {
            const Res = await this.adminUserCase.fetchDashBoardCount()
            res.json(Res)
        } catch (error) {
            console.log('admin fetchDashBoardCount error in admin controller :',error);
        }
    }
    async fetchDashBoardGraphData(req:Request,res:Response){
        try {
            const {DataType,DateType} = req.query
            const Res = await this.adminUserCase.fetchDashBoardGraphData(DataType,DateType)
            res.json(Res)
        } catch (error) {
            console.log('admin fetchDashBoardGraphData error in admin controller :',error);
        }
    }
    async fetchAllUserData(req:Request,res:Response){
        try {
            const userType = req.query.userType
            const Res = await this.adminUserCase.fetchAllUserData(userType)
            res.json(Res)
        } catch (error) {
            console.log('admin fetchAllUserData error in admin controller :',error);
        }
    }

    async getUserData(req:Request,res:Response){
        try {

            const userId = req.query.userId
            const userType = req.query.userType
            console.log('userid:',userId);
            
            const Res = await this.userCase.getUserData(userId,userType)
             res.json(Res)
        } catch (error) {
            console.log('get user data for edit user detail in profile error :',error);
            
        }
    }

    async updateUserData(req:Request,res:Response){
        try {
            const userId = req.query.userId
            const userType = req.query.userType
            const userData = req.body
          
            const Res = await this.userCase.updateUserData(userData,userId,userType)
             res.json(Res)
        } catch (error) {
            console.log('get user data for edit user detail in profile error :',error);
            
        }
    }

    async uploadImg (req:Request,res:Response){
        try {
            const userProfile = req.body.fileURL
            const userId = req.query.userId
            const userType = req.query.userType
            const resp = await this.userCase.uploadUserProfile(userProfile,userId,userType)          
            return res.json(resp)
        } catch (error) {
            console.log('uploadImg error in userController :',error);
            
        }
    }   
    async handleBlockOrUnblock (req:Request,res:Response){
        try {
            const userId = req.query.userId
            const userType = req.query.userType
            const resp = await this.adminUserCase.handleBlockOrUnblock(userId,userType)          
            return res.json(resp)
        } catch (error) {
            console.log('uploadImg error in userController :',error);
            
        }
    }  
    async fetchAllBookingData (req:Request,res:Response){
        try {
            const resp = await this.adminUserCase.fetchAllBookingData()          
            return res.json(resp)
        } catch (error) {
            console.log('uploadImg error in userController :',error);
            
        }
    }  
    async fetchAllPostReportData (req:Request,res:Response){
        try {
            const resp = await this.adminUserCase.fetchAllPostReportData()          
            return res.json(resp)
        } catch (error) { 
            console.log('fetchAllPostReportData error in userController :',error); 
            
        }
    } 
    async findUserPostById (req:Request,res:Response){
        try {
            const postId = req.query.postId
            const isDeleted = req.query.isDeleted
            const resp = await this.adminUserCase.findUserPostById(postId,isDeleted)          
            return res.json(resp)
        } catch (error) { 
            console.log('uploadImg error in userController :',error);
            
        }
    }  

    async adminDeletePost(req:Request,res:Response){
        try {
            const {postId} = req.query
            const Response = await this.adminUserCase.deletePost(postId)
            res.json(Response)
        } catch (error) {
            console.log('deletePost error in userController :',error);
        }
    }
}

export default AdminController