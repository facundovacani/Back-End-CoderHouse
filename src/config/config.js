require("dotenv").config();

const parseArgs = require("minimist");
const optionsDefault = {default: {PORT: 8080}};
const args = parseArgs(process.argv.slice(2), optionsDefault);
module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: args.PORT
};