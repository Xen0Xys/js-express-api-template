const {getUser, createUser, getUsers, removeUser} = require("@controllers/user.controller");
const userValidation = require("@validations/user.validation");
const jwtAuth = require("@middlewares/jwt.middleware");
const {StatusCodes} = require("http-status-codes");
const {validate} = require("express-validation");

module.exports = (app, opts, done) => {
    app.get("/users",
        async(req, res) => {
            await getUsers(req, res);
        });
    app.get("/user/:id", {
        preHandler: jwtAuth,
        schema: userValidation.fetch
    },
    async(req, res) => {
        await getUser(req, res);
    });
    // app.post("/user",
    //     validate(userValidation.create, {context: false, statusCode: StatusCodes.BAD_REQUEST, keyByField: false}),
    //     async(req, res) => {
    //         await createUser(req, res);
    //     });
    // app.delete("/user/:id",
    //     jwtAuth,
    //     validate(userValidation.remove, {context: false, statusCode: StatusCodes.BAD_REQUEST, keyByField: false}),
    //     async(req, res) => {
    //         await removeUser(req, res);
    //     });
    done();
};
