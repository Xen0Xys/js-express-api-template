const {getUser, createUser} = require("@controllers/user.controller");
const userValidation = require("@validations/user.validation");
const jwtAuth = require("@middlewares/jwt.middleware");
const {StatusCodes} = require("http-status-codes");
const {validate} = require("express-validation");

module.exports = (router) => {
    router.get("/user/:id",
        jwtAuth,
        validate(userValidation.fetch, {context: false, statusCode: StatusCodes.BAD_REQUEST, keyByField: false}),
        async(req, res) => {
            await getUser(req, res);
        });
    router.post("/user",
        validate(userValidation.create, {context: false, statusCode: StatusCodes.BAD_REQUEST, keyByField: false}),
        async(req, res) => {
            await createUser(req, res);
        });
};
