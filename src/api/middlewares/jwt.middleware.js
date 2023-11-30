/* eslint-disable no-undef */
const {StatusCodes} = require("http-status-codes");
const {User} = require("@database/database");
const jwt = require("jsonwebtoken");

module.exports = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "No token provided"});
    const token = authHeader.split(" ")[1];
    if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({message: "No token provided"});
    let decodedToken;
    try{
        decodedToken = await jwt.verify(token, process.env.JWT_KEY);
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
