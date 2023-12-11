const {StatusCodes, ReasonPhrases} = require("http-status-codes");
const {User} = require("@database/database");
const {getFlag} = require("@services/user.service");
const {hashPassword} = require("../../lib/utils/encryption");

async function getUser(req, res){
    const userId = req.params.id;
    try{
        const user = await User.findOne({where: {id: userId}});
        if(!user)
            return res.code(StatusCodes.NOT_FOUND).send({message: ReasonPhrases.NOT_FOUND});
        const jsonUser = user.toJSON();
        jsonUser.flag = await getFlag(jsonUser.countryCode);
        delete jsonUser.password;
        return res.code(StatusCodes.OK).send(jsonUser);
    }catch (e){
        return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
}

async function createUser(req, res){
    const {firstName, lastName, countryCode, email, password, groupId} = req.body;
    const passwordHash = await hashPassword(password);
    try{
        const user = await User.create({firstName, lastName, countryCode, email, password: passwordHash, groupId});
        const jsonUser = user.toJSON();
        jsonUser.flag = await getFlag(jsonUser.countryCode);
        delete jsonUser.password;
        return res.code(StatusCodes.CREATED).send(jsonUser);
    }catch (e){
        return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
}

async function removeUser(req, res){
    const id = req.params.id;
    try {
        const user = await User.findOne({where: {id}});
        if (!user)
            return res.code(StatusCodes.NOT_FOUND).send({message: ReasonPhrases.NOT_FOUND});
        await user.destroy();
        return res.code(StatusCodes.NO_CONTENT).send();
    }catch (e){
        return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
}

async function getUsers(req, res){
    try{
        const users = await User.findAll();
        const jsonUsers = users.map(user => {
            const jsonUser = user.toJSON();
            delete jsonUser.password;
            return jsonUser;
        });
        return res.code(StatusCodes.OK).send(jsonUsers);
    }catch (e){
        return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
}

module.exports = {
    getUser,
    createUser,
    removeUser,
    getUsers
};

