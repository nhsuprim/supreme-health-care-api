import multer from "multer"
import path, { resolve } from "path"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ICloudinaryRes, IFile } from "../interface/file";

// Configuration
cloudinary.config({ 
    cloud_name: 'dgak3ha1i', 
    api_key: '172911419654983', 
    api_secret: '8KCIwv6b63vh--oIHRbMjjfuejY' // Click 'View Credentials' below to copy your API secret
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(),'uploads'))
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
  
  const upload = multer({ storage: storage })
 
    // Upload an image
  const uploadToCloudinary = (file: IFile): Promise<ICloudinaryRes> =>{

    return new Promise ((resolve, reject)=>{
      cloudinary.uploader
      .upload(
          file.path,
          (err:Error, result:ICloudinaryRes) => {
            fs.unlinkSync(file.path)
           if (err) {
            reject(err);
          } else {
            resolve(result)
          }}
      )
      
    })

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
  }
    

  export const fileUploader ={
    upload,
    uploadToCloudinary
  }