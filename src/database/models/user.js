/*eslint-disable no-unused-vars*/
import {Model} from "sequelize";
import {Joi} from "sequelize-joi";
export default (sequelize, DataTypes) => {
    class User extends Model{
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
