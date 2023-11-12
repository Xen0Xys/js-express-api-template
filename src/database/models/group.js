/*eslint-disable no-unused-vars*/
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Group extends Model{
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models){
            this.hasMany(models.User, {
                foreignKey: "groupId",
                as: "users"
            });
        }
    }
    Group.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: "Group",
    });
    return Group;
};
