"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const commentSchema = new mongoose_1.Schema({
    comment: { type: String },
    commentedId: { type: String },
    comment_likes: { type: Number, default: 0 },
    commentTime: { type: Date, default: new Date() }
});
const ratingSchema = new mongoose_1.Schema({
    raterId: { type: String },
    rate: { type: Number },
    ratedDate: { type: Date, default: new Date() }
});
const DeletedPostSchema = new mongoose_1.Schema({
    userId: { type: String },
    post: { type: String },
    description: { type: String },
    location: { type: String },
    date: { type: Date, default: Date.now },
    like: { type: [String] },
    comments: { type: [String] },
    ratings: { type: [ratingSchema] },
    isProperty: { type: Boolean },
    PostProfile: { type: String },
    PostName: { type: String },
});
const DeletedPostModel = mongoose_1.default.model('DeletedPost', DeletedPostSchema);
exports.default = DeletedPostModel;
