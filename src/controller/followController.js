"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class FollowController {
    constructor(fUseCase) {
        this.fUseCase = fUseCase;
    }
    FollowRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const Response = yield this.fUseCase.FollowRequest(data);
                res.json(Response);
            }
            catch (error) {
                console.log('Follow request error in follow controller:', error);
                throw error;
            }
        });
    }
    unFollowRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const Response = yield this.fUseCase.unFollowRequest(data);
                res.json(Response);
            }
            catch (error) {
                console.log('Follow request error in follow controller:', error);
                throw error;
            }
        });
    }
    checkIsFollwoed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.query;
                const Response = yield this.fUseCase.checkIsFollwoed(data);
                res.json(Response);
            }
            catch (error) {
                console.log('checkIsFollwoed  error in follow controller:', error);
                throw error;
            }
        });
    }
    isFollwerRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.query;
                const Response = yield this.fUseCase.isFollwerRequest(data);
                res.json(Response);
            }
            catch (error) {
                console.log('checkIsFollwoed  error in follow controller:', error);
                throw error;
            }
        });
    }
    confirmFollReq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const Response = yield this.fUseCase.confirmFollReq(data);
                res.json(Response);
            }
            catch (error) {
                console.log('checkIsFollwoed  error in follow controller:', error);
                throw error;
            }
        });
    }
    cancelFollReq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const Response = yield this.fUseCase.cancelFollReq(data);
                res.json(Response);
            }
            catch (error) {
                console.log('checkIsFollwoed  error in follow controller:', error);
                throw error;
            }
        });
    }
    fetchAllFollowData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                const Response = yield this.fUseCase.fetchAllFollowData(userId);
                res.json(Response);
            }
            catch (error) {
                console.log('checkIsFollwoed  error in follow controller:', error);
                throw error;
            }
        });
    }
    fetchFollowerOriginalData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { isFollowing, userId } = req.query;
                const Response = yield this.fUseCase.fetchFollowerOriginalData(userId, isFollowing);
                console.log('follwer data :====>', Response);
                res.json(Response);
            }
            catch (error) {
                console.log('checkIsFollwoed  error in follow controller:', error);
                throw error;
            }
        });
    }
}
exports.default = FollowController;
