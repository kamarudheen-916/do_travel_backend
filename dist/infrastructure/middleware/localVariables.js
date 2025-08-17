"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localVariables = localVariables;
function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        userType: null,
        email: null
    };
    next();
}
