const CDB_USER = process.env.CDB_USER;
const CDB_PWD = process.env.CDB_PWD;
console.log("Before DB connection");
export const nano = require('nano')("http://" + CDB_USER + ":" + CDB_PWD + "@localhost:5984");
console.log("After DB connection");
export const PubSubDB = nano.db.use('pubsub');