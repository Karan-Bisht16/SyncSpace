import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        if (!token) {
            token = req.query.token;
        }
        let decodedData;
        try {
            if (token) {
                decodedData = jwt.verify(token, process.env.JWT_TOKEN_KEY);
                next();
            }
        } catch (error) {
            res.status(409).json({ message: "Invalid token credentials." });
        }
    } catch (error) {
        res.sendStatus(404);
    }
}

export default auth;