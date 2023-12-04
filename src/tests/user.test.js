const {StatusCodes} = require("http-status-codes");
const testConfig = require("./config");
const {Joi} = require("express-validation");
const {generateJWT} = require("../lib/utils/encryption");
const {api, expect, chai} = testConfig;

const testToken = generateJWT({id: 1}, process.env.TOKEN_DURATION, process.env.JWT_KEY, true);
const testUser = {
    firstName: "Test",
    lastName: "User",
    countryCode: "US",
    email: "test.email@example.fr",
    groupId: 1,
    password: "123456"
};
const userValidation = Joi.object({
    id: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    countryCode: Joi.string(),
    flag: Joi.string(),
    groupId: Joi.number().required(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
});

describe("User tests", async() => {
    it("Get user from id", async() => {
        const res = await chai.request(api).get("/api/v1/user/1").set("Authorization", "Bearer " + testToken);
        expect(res).to.have.status(StatusCodes.OK);
        Joi.assert(res.body, userValidation);
    });
    it("Get user with non-numeric id", async() => {
        const res = await chai.request(api).get("/api/v1/user/test").set("Authorization", "Bearer " + testToken);
        expect(res).to.have.status(StatusCodes.BAD_REQUEST);
        expect(res.body).to.have.property("message");
    });
    it("Get user with no authentication", async() => {
        const res = await chai.request(api).get("/api/v1/user/test");
        expect(res).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it("Create new user", async() => {
        const postRes = await chai.request(api).post("/api/v1/user").send(testUser);
        expect(postRes).to.have.status(StatusCodes.CREATED);
        Joi.assert(postRes.body, userValidation);
        const getRes = await chai.request(api).get("/api/v1/user/4").set("Authorization", "Bearer " + testToken);
        expect(getRes).to.have.status(StatusCodes.OK);
    });
    it("Create new user without required fields", async() => {
        const res = await chai.request(api).post("/api/v1/user");
        expect(res).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it("Get users", async() => {
        const res = await chai.request(api).get("/api/v1/users").set("Authorization", "Bearer " + testToken);
        expect(res).to.have.status(StatusCodes.OK);
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(4);
        for(let i = 0; i < res.body.length; i++)
            Joi.assert(res.body[i], userValidation);
    });
    it("Get users without authentication", async() => {
        const res = await chai.request(api).get("/api/v1/users");
        expect(res).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it("Delete user", async() => {
        const deleteRes = await chai.request(api).delete("/api/v1/user/4").set("Authorization", "Bearer " + testToken);
        expect(deleteRes).to.have.status(StatusCodes.NO_CONTENT);
        const getRes = await chai.request(api).get("/api/v1/user/4").set("Authorization", "Bearer " + testToken);
        expect(getRes).to.have.status(StatusCodes.NOT_FOUND);
    });
    it("Delete user without authentication", async() => {
        const res = await chai.request(api).delete("/api/v1/user/4");
        expect(res).to.have.status(StatusCodes.UNAUTHORIZED);
    });
});
