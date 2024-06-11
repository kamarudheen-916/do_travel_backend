"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const dependencyController_1 = require("../utils/dependencyController");
const chatRouter = express_1.default.Router();
chatRouter.get("/getMessage/:id", userAuth_1.default, (req, res) => dependencyController_1.cController.getMessages(req, res));
chatRouter.post('/sendMessage/:id', userAuth_1.default, (req, res) => dependencyController_1.cController.sendMessage(req, res));
chatRouter.get("/getUsersSideBar", userAuth_1.default, (req, res) => dependencyController_1.cController.getUsersForSidebar(req, res));
exports.default = chatRouter;
