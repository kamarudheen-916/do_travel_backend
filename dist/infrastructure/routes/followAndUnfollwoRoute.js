"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const dependencyController_1 = require("../utils/dependencyController");
const followUnfollowRouter = express_1.default.Router();
followUnfollowRouter.post('/FollowRequest', userAuth_1.default, (req, res) => dependencyController_1.followController.FollowRequest(req, res));
followUnfollowRouter.put('/unFollowRequest', userAuth_1.default, (req, res) => dependencyController_1.followController.unFollowRequest(req, res));
followUnfollowRouter.get('/checkIsFollwoed', userAuth_1.default, (req, res) => dependencyController_1.followController.checkIsFollwoed(req, res));
followUnfollowRouter.get('/fetchFollwerRequest', userAuth_1.default, (req, res) => dependencyController_1.followController.isFollwerRequest(req, res));
followUnfollowRouter.post('/confirmFollReq', userAuth_1.default, (req, res) => dependencyController_1.followController.confirmFollReq(req, res));
followUnfollowRouter.put('/cancelFollReq', userAuth_1.default, (req, res) => dependencyController_1.followController.cancelFollReq(req, res));
followUnfollowRouter.get('/fetchAllFollowdata', userAuth_1.default, (req, res) => dependencyController_1.followController.fetchAllFollowData(req, res));
followUnfollowRouter.get('/fetchFollowerOriginalData', userAuth_1.default, (req, res) => dependencyController_1.followController.fetchFollowerOriginalData(req, res));
exports.default = followUnfollowRouter;
