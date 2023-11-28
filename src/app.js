const dotenv = await import("dotenv");
dotenv.config();

const database = await import("#database/index");
const api = await import("#api/api");

export {database, api};
