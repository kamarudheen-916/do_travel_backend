"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthRouter = express_1.default.Router();
const localVariables_1 = require("../middleware/localVariables");
const dependencyController_1 = require("../utils/dependencyController");
userAuthRouter.post('/signup_user', localVariables_1.localVariables, (req, res) => dependencyController_1.uController.signUpUser(req, res));
userAuthRouter.post('/signup_property', (req, res) => dependencyController_1.uController.signUpProperty(req, res));
userAuthRouter.post('/verifyOTP/:userId', (req, res) => dependencyController_1.uController.verifyOTP(req, res));
userAuthRouter.post('/login', (req, res) => dependencyController_1.uController.loginUser(req, res));
userAuthRouter.post('/forgottenPassword', (req, res) => dependencyController_1.uController.forgottenPass(req, res));
userAuthRouter.post('/verifyForgetOTP', (req, res) => dependencyController_1.uController.verifyForgottenOTP(req, res));
userAuthRouter.post('/ResendOtp/:userType/:email', (req, res) => dependencyController_1.uController.resendOTP(req, res));
exports.default = userAuthRouter;
