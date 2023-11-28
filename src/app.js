const dotenv = await import("dotenv");
dotenv.config();

const database = await import("#database/index");
const api = await import("#api/api");

console.log(api.address());

export {database, api};
