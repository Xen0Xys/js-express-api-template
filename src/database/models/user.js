/*eslint-disable no-unused-vars*/
const {
    Model
} = require("sequelize");
const {Joi} = require("sequelize-joi");
module.exports = (sequelize, DataTypes) => {
    class User extends Model{
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models){
            // define association here
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
        }
    }, {
        sequelize,
        modelName: "User",
    });
    return User;
};
