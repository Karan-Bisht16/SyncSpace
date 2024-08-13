import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const getExtension = (file) => {
    let ext = path.extname(file.originalname);
    if (ext === "") {
        ext = file.mimetype.replace("/", ".");
    }
    return ext;
}

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "./uploads/temp")
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + "-" + uuidv4() + getExtension(file))
//     }
// })

export const upload = multer({ storage });