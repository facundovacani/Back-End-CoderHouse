require("dotenv").config();

// const parseArgs = require("minimist");
// const optionsDefault = {default: {PORT: 8080}};
// const args = parseArgs(process.argv.slice(2), optionsDefault);
const PORT = parseInt(process.argv[2]) || 8080

module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: PORT
};