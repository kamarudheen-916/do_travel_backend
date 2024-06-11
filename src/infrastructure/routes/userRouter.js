"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const dependencyController_1 = require("../utils/dependencyController");
const homeRouter = express_1.default.Router();
homeRouter.get('/checkIsBlocked', userAuth_1.default, (req, res) => dependencyController_1.uController.checkIsBlocked(req, res));
homeRouter.get('/getAllFeeds', userAuth_1.default, (req, res) => dependencyController_1.uController.getAllFeeds(req, res));
homeRouter.get('/getAllPosts', userAuth_1.default, (req, res) => dependencyController_1.uController.getAllPosts(req, res));
homeRouter.get('/getOthersProfilePosts', userAuth_1.default, (req, res) => dependencyController_1.uController.getOthersProfile(req, res));
homeRouter.get('/userSearch', userAuth_1.default, (req, res) => dependencyController_1.uController.userSearch(req, res));
homeRouter.put('/setThemeMode', userAuth_1.default, (req, res) => dependencyController_1.uController.setThemeMode(req, res));
homeRouter.get('/getThemeMode', userAuth_1.default, (req, res) => dependencyController_1.uController.getThemeMode(req, res));
exports.default = homeRouter;
