/*eslint-disable no-unused-vars*/
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Group extends Model{
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
