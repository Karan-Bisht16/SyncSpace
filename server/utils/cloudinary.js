import fs from "fs";
import "dotenv/config";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (filePath) => {
    let retries = 0;
    let finalStatusValue;
    let fileURL;
    let filePublicId;
    while (retries < 5) {
        try {
            const { status, ...rest } = await uploadOnCloudinary(filePath);
            finalStatusValue = status;
            if (status === 0) {
                break;
            } else if (status === 1) {
                fs.unlinkSync(filePath);
                fileURL = rest.fileURL;
                filePublicId = rest.filePublicId;
                break;
            }
        } catch (error) {
            console.log(error);
            break;
        }
        retries++;
    }
    return { retries, finalStatusValue, fileURL, filePublicId };
}
const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return { status: 0 };       // 0 -> no file path
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        return { status: 1, fileURL: response.url, filePublicId: response.public_id };      // 1 -> success
    } catch (error) {
        console.log(error);
        return { status: 2 };       // 2 -> failure
    }
}
const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return null;
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const deleteManyFromCloudinary = async (publicIds) => {
    if (!publicIds) return null;
    try {
        const response = await cloudinary.api.delete_resources(publicIds);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { uploadFile, uploadOnCloudinary, deleteFromCloudinary, deleteManyFromCloudinary };