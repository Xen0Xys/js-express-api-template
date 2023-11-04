const {getUser, createUser} = require("../../controllers/user.controller");
const userValidation = require("../../validations/user.validation");
const {validate} = require("express-validation");
const jwtAuth = require("../../middlewares/jwt.middleware");

module.exports = (router) => {
    router.get("/user/:id",
        jwtAuth,
        validate(userValidation.fetch, {context: false, statusCode: 400, keyByField: false}),
        async(req, res) => {
            await getUser(req, res);
        });
    router.post("/user",
        validate(userValidation.create, {context: false, statusCode: 400, keyByField: false}),
        async(req, res) => {
            await createUser(req, res);
        });
};
