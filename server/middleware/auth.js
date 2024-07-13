import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        if (!token) {
            token = req.query.token;
        }
        const isCustomToken = token.length < 500;
        let decodedData;
        try {
            if (token && isCustomToken) {
                decodedData = jwt.verify(token, process.env.JWT_TOKEN_KEY);
            } else if (token && !isCustomToken) {
                decodedData = jwt.decode(token);
            }
            next();
        } catch (error) {
            console.log(error.message);
            res.status(409).json({ message: "Invalid token credentials." })
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: "No token found" })
    }
}

export default auth;