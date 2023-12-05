/*eslint-disable no-unused-vars*/
const {Model} = require("sequelize");
const {Joi} = require("sequelize-joi");
module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        static associate(models){
            models.User.belongsTo(models.Group, {
                foreignKey: "groupId",
                as: "group"
            });
        }
    }
    User.init({
        firstName: DataTypes.STRING(50),
        lastName: DataTypes.STRING(50),
        countryCode: DataTypes.STRING(3),
        email: {
            type: DataTypes.STRING(100),
            schema: Joi.string().email().required()
        },
        password: {
            type: DataTypes.STRING(100),
            schema: Joi.string().required()
        },
        groupId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: "User",
    });
    return User;
};
