/*eslint-disable no-unused-vars*/
import {Model} from "sequelize";
export default (sequelize, DataTypes) => {
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
