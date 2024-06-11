"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localVariables = void 0;
function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        userType: null,
        email: null
    };
    next();
}
exports.localVariables = localVariables;
