export interface PostReport{
    _id?:string
    postId:string
    reporterType:string
    reporterId:string
    reason:string
    reportDate:Date
    status:string
    reporterName:string|undefined

}