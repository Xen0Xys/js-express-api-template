const dotenv = await import("dotenv");
dotenv.config();

const database = await import("#database/index");
const app = await import("#api/api");

export {database, app};
