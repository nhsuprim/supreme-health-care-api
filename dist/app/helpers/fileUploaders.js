"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
// Configuration
cloudinary_1.v2.config({
    cloud_name: 'dgak3ha1i',
    api_key: '172911419654983',
    api_secret: '8KCIwv6b63vh--oIHRbMjjfuejY' // Click 'View Credentials' below to copy your API secret
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Upload an image
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload(file.path, (err, result) => {
            fs_1.default.unlinkSync(file.path);
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
    // cloudinary.uploader
    // .upload(
    //     '/home/nhsuprim/Desktop/WorkStation/supreme health care/server/uploads/carRental.jpeg', {
    //         public_id: 'shoes',
    //     },
    //     function(err, data){
    //      console.log(data);
    //     }
    // )
    // .catch((error) => {
    //     console.log(error);
    // });
};
exports.fileUploader = {
    upload,
    uploadToCloudinary
};
