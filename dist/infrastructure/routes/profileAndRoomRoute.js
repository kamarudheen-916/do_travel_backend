"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const dependencyController_1 = require("../utils/dependencyController");
const propertyAuth_1 = __importDefault(require("../middleware/propertyAuth"));
const porfileAndRoomRouter = express_1.default.Router();
//to get user profile data for editing purpose (for both normal user and property user )
porfileAndRoomRouter.get('/getUserData', userAuth_1.default, (req, res) => dependencyController_1.uController.getUserData(req, res));
//to update the user profile data (for both normal user and property user )
porfileAndRoomRouter.put('/updateUserData', userAuth_1.default, (req, res) => dependencyController_1.uController.updateUserData(req, res));
porfileAndRoomRouter.put('/uploadImg', userAuth_1.default, (req, res) => dependencyController_1.uController.uploadImg(req, res));
porfileAndRoomRouter.post('/propertyCreate', propertyAuth_1.default, (req, res) => dependencyController_1.pController.propertyCreate(req, res));
porfileAndRoomRouter.post('/addRoom', propertyAuth_1.default, (req, res) => dependencyController_1.pController.addRoom(req, res));
porfileAndRoomRouter.put('/editRoom', propertyAuth_1.default, (req, res) => dependencyController_1.pController.editRoom(req, res));
porfileAndRoomRouter.get('/fetchRoomData', propertyAuth_1.default, (req, res) => dependencyController_1.pController.fetchRoomData(req, res));
porfileAndRoomRouter.get('/fetchOtherProfileRoomData', userAuth_1.default, (req, res) => dependencyController_1.pController.fetchOtherProfileRoomData(req, res));
porfileAndRoomRouter.delete('/deleteRoom', userAuth_1.default, (req, res) => dependencyController_1.pController.deleteRoom(req, res));
porfileAndRoomRouter.put('/updateRoomRating', userAuth_1.default, (req, res) => dependencyController_1.uController.updateRating(req, res));
exports.default = porfileAndRoomRouter;
