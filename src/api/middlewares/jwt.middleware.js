const {StatusCodes} = require("http-status-codes");
const {User} = require("@database/database");
const {verifyJWT} = require("../../lib/utils/encryption");

module.exports = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "No token provided"});
    const token = authHeader.split(" ")[1];
    if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({message: "No token provided"});
    let decodedToken;
    try{
        decodedToken = verifyJWT(token);
    }catch(e){
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid token", error: e});
    }
    if(!decodedToken) return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid token"});
    const user = await User.findOne({where: {id: decodedToken.id}});
    if(!user) return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    const jsonUser = user.toJSON();
    delete jsonUser.password;
    req.user = jsonUser;
    next();
};
