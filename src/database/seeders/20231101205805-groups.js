/*eslint-disable no-unused-vars*/
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize){
        return queryInterface.bulkInsert("groups", [
            {
                name: "admin",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "user",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize){
        return queryInterface.bulkDelete("groups", null, {});
    }
};
