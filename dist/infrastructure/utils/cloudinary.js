"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: 'djfsuoryg',
    api_key: '848529839812396',
    api_secret: 'g-hcSpfQOHllIpgdesgepLWEBcY'
});
class Cloudinary {
    async saveToCloudinary(file) {
        const result = await cloudinary_1.v2.uploader.upload(file);
        return file = result.secure_url;
    }
}
exports.default = Cloudinary;
