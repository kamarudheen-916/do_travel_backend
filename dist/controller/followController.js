"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FollowController {
    constructor(fUseCase) {
        this.fUseCase = fUseCase;
    }
    async FollowRequest(req, res) {
        try {
            const data = req.body;
            const Response = await this.fUseCase.FollowRequest(data);
            res.json(Response);
        }
        catch (error) {
            console.log('Follow request error in follow controller:', error);
            throw error;
        }
    }
    async unFollowRequest(req, res) {
        try {
            const data = req.body;
            const Response = await this.fUseCase.unFollowRequest(data);
            res.json(Response);
        }
        catch (error) {
            console.log('Follow request error in follow controller:', error);
            throw error;
        }
    }
    async checkIsFollwoed(req, res) {
        try {
            const data = req.query;
            const Response = await this.fUseCase.checkIsFollwoed(data);
            res.json(Response);
        }
        catch (error) {
            console.log('checkIsFollwoed  error in follow controller:', error);
            throw error;
        }
    }
    async isFollwerRequest(req, res) {
        try {
            const data = req.query;
            const Response = await this.fUseCase.isFollwerRequest(data);
            res.json(Response);
        }
        catch (error) {
            console.log('checkIsFollwoed  error in follow controller:', error);
            throw error;
        }
    }
    async confirmFollReq(req, res) {
        try {
            const data = req.body;
            const Response = await this.fUseCase.confirmFollReq(data);
            res.json(Response);
        }
        catch (error) {
            console.log('checkIsFollwoed  error in follow controller:', error);
            throw error;
        }
    }
    async cancelFollReq(req, res) {
        try {
            const data = req.body;
            const Response = await this.fUseCase.cancelFollReq(data);
            res.json(Response);
        }
        catch (error) {
            console.log('checkIsFollwoed  error in follow controller:', error);
            throw error;
        }
    }
    async fetchAllFollowData(req, res) {
        try {
            const { userId } = req.query;
            const Response = await this.fUseCase.fetchAllFollowData(userId);
            res.json(Response);
        }
        catch (error) {
            console.log('checkIsFollwoed  error in follow controller:', error);
            throw error;
        }
    }
    async fetchFollowerOriginalData(req, res) {
        try {
            const { isFollowing, userId } = req.query;
            const Response = await this.fUseCase.fetchFollowerOriginalData(userId, isFollowing);
            console.log('follwer data :====>', Response);
            res.json(Response);
        }
        catch (error) {
            console.log('checkIsFollwoed  error in follow controller:', error);
            throw error;
        }
    }
}
exports.default = FollowController;
