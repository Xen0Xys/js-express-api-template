import {StatusCodes, ReasonPhrases} from "http-status-codes";
import db from "#database/index";
import {getFlag} from "#services/user.service";
import {hashPassword} from "#utils/encryption";
const User = db.User;

export async function getUser(req, res){
    const userId = req.params.id;
    try{
        const user = await User.findOne({where: {id: userId}});
        if(!user)
            return res.status(StatusCodes.NOT_FOUND).json({message: ReasonPhrases.NOT_FOUND});
        const jsonUser = user.toJSON();
        jsonUser.flag = await getFlag(jsonUser.countryCode);
        delete jsonUser.password;
        return res.status(StatusCodes.OK).json(jsonUser);
    }catch (e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
    }
}

export async function createUser(req, res){
    const {firstName, lastName, countryCode, email, password, groupId} = req.body;
    const passwordHash = await hashPassword(password);
    try{
        const user = await User.create({firstName, lastName, countryCode, email, password: passwordHash, groupId});
        const jsonUser = user.toJSON();
        jsonUser.flag = await getFlag(jsonUser.countryCode);
        delete jsonUser.password;
        return res.status(StatusCodes.CREATED).json(jsonUser);
    }catch (e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
    }
}

export async function removeUser(req, res){
    const id = req.params.id;
    try {
        const user = await User.findOne({where: {id}});
        if (!user)
            return res.status(StatusCodes.NOT_FOUND).json({message: ReasonPhrases.NOT_FOUND});
        await user.destroy();
        return res.status(StatusCodes.NO_CONTENT).json();
    }catch (e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
    }
}

export async function getUsers(req, res){
    try{
        const users = await User.findAll();
        const jsonUsers = users.map(user => {
            const jsonUser = user.toJSON();
            delete jsonUser.password;
            return jsonUser;
        });
        return res.status(StatusCodes.OK).json(jsonUsers);
    }catch (e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
    }
}
