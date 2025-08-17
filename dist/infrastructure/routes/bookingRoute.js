"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const dependencyController_1 = require("../utils/dependencyController");
const bookingRouter = express_1.default.Router();
bookingRouter.get('/checkRoomAvailability', userAuth_1.default, (req, res) => dependencyController_1.bookingController.checkRoomAvailability(req, res));
bookingRouter.post('/confirmBooking', userAuth_1.default, (req, res) => dependencyController_1.bookingController.confirmBooking(req, res));
bookingRouter.post('/onlinePayment', userAuth_1.default, (req, res) => dependencyController_1.bookingController.onlinePayment(req, res));
bookingRouter.get('/fetchAllBookings', userAuth_1.default, (req, res) => dependencyController_1.bookingController.fetchAllBookings(req, res));
bookingRouter.put('/cancelBookings', userAuth_1.default, (req, res) => dependencyController_1.bookingController.cancelBookings(req, res));
exports.default = bookingRouter;
