import {getUser, createUser, getUsers, removeUser} from "#controllers/user.controller";
import userValidation from "#validations/user.validation";
import jwtAuth from "#middlewares/jwt.middleware";
import {StatusCodes} from "http-status-codes";
import {validate} from "express-validation";

export default (router) => {
    router.get("/users",
        jwtAuth,
        async(req, res) => {
            await getUsers(req, res);
        });
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
    router.delete("/user/:id",
        jwtAuth,
        validate(userValidation.remove, {context: false, statusCode: StatusCodes.BAD_REQUEST, keyByField: false}),
        async(req, res) => {
            await removeUser(req, res);
        });
};
