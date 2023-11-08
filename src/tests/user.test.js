const {StatusCodes} = require("http-status-codes");
const testConfig = require("./config");
const {Joi} = require("express-validation");
const {app, expect, chai} = testConfig;

const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.9n1ShpDxEYGwgbmikckZiD45BqRD2UkoN_tYip-pLy0";
const testUser = {
    firstName: "Test",
    lastName: "User",
    countryCode: "US",
    email: "test.email@example.fr",
    password: "123456"
};
const userValidation = Joi.object({
    id: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    countryCode: Joi.string(),
    flag: Joi.string(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
});

describe("User tests", async() => {
    it("Get user from id", async() => {
        const res = await chai.request(app).get("/api/v1/user/1").set("Authorization", "Bearer " + testToken);
        expect(res).to.have.status(StatusCodes.OK);
        Joi.assert(res.body, userValidation);
    });
    it("Get user with non-numeric id", async() => {
        const res = await chai.request(app).get("/api/v1/user/test").set("Authorization", "Bearer " + testToken);
        expect(res).to.have.status(StatusCodes.BAD_REQUEST);
        expect(res.body).to.have.property("message");
    });
    it("Get user with no authentication", async() => {
        const res = await chai.request(app).get("/api/v1/user/test");
        expect(res).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it("Create new user without required fields", async() => {
        const res = await chai.request(app).post("/api/v1/user");
        expect(res).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it("Create new user", async() => {
        const res = await chai.request(app).post("/api/v1/user").send(testUser);
        expect(res).to.have.status(StatusCodes.CREATED);
        Joi.assert(res.body, userValidation);
    });
    it("Error test", async() => {
        const res = await chai.request(app).get("/api/v1/user/error");
        expect(res).to.have.status(StatusCodes.OK);
    });
});
