const {StatusCodes} = require("http-status-codes");
const {User} = require("@database/database");
const {verifyJWT} = require("../../lib/utils/encryption");

module.exports = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.code(StatusCodes.UNAUTHORIZED).send({message: "No token provided"});
    const token = authHeader.split(" ")[1];
    if(!token) return res.code(StatusCodes.UNAUTHORIZED).send({message: "No token provided"});
    let decodedToken;
    try{
        decodedToken = verifyJWT(token, process.env.JWT_KEY);
    }catch(e){
        return res.code(StatusCodes.UNAUTHORIZED).send({message: "Invalid token", error: e});
    }
    if(!decodedToken) return res.code(StatusCodes.UNAUTHORIZED).send({message: "Invalid token"});
    const user = await User.findOne({where: {id: decodedToken.id}});
    if(!user) return res.code(StatusCodes.NOT_FOUND).send({message: "User not found"});
    const jsonUser = user.toJSON();
    delete jsonUser.password;
    req.user = jsonUser;
    next();
};
