const {User} = require("@database/database");
const {Op} = require("sequelize");
const cron = require("node-cron");

cron.schedule("0 0 0 * * *", async() => {
    console.log("Deleting users older than 3 years...");
    const usersToDelete = await User.findAll({
        where: {
            updatedAt: {
                [Op.lt]: new Date(new Date().setFullYear(new Date().getFullYear() - 3))
            }
        }
    });
    for(const user of usersToDelete){
        console.log(`Deleting user ${user.id} ${user.firstName} ${user.lastName} ${user.email}`);
        await user.destroy();
    }
    console.log("Done!");
});
