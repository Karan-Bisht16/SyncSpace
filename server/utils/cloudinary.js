import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (fileBuffer) => {
    if (!fileBuffer) return null;

    const result = await new Promise((resolve) => {
        cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                console.log("FileUploadError: ", error);
                return res.status(500).send({ error: "Failed to upload image" });
            }
            return resolve(result);
        }).end(fileBuffer);
    });
    return result;
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

export { uploadFile, deleteFromCloudinary, deleteManyFromCloudinary };