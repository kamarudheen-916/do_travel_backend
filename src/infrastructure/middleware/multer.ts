import multer from 'multer'

const  userProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/UserProfileImages/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return cb(null, uniqueSuffix + '-' +  file.originalname)
    }
});

const  propertyStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/propertyProfileImages/');
    }, 
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return cb(null, uniqueSuffix + '-' +  file.originalname)
    }
});
const  propertyLicenseStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/propertyLicenseImage/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return cb(null, uniqueSuffix + '-' +  file.originalname)
    }
});
export const userProfileUpload = multer({ storage: userProfileStorage });
export const propertyUpload = multer({ storage: propertyStorage });
export const propertyLicenseUpload = multer({ storage: propertyLicenseStorage });


