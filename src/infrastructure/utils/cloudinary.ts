import {v2 as cloudinary} from 'cloudinary'
import ICloudinary from '../../useCase/interface/ICloudinary';

 cloudinary.config({ 
    cloud_name: 'djfsuoryg', 
    api_key:    '848529839812396', 
    api_secret: 'g-hcSpfQOHllIpgdesgepLWEBcY' 
  });

  class Cloudinary implements ICloudinary {
    async  saveToCloudinary(file: string): Promise<any> {
        const result =await cloudinary.uploader.upload(file)
        return file = result.secure_url
    }
  }

  export default Cloudinary