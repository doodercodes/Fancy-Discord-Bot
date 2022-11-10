const fs = require("node:fs");
const path = require("node:path");
const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");

const commandPath = path.join(__dirname, "../commands");
// console.log(`${commandPath}`);

module.exports = (client) => {
  let commands;
//   fs.readFileSync(commandPath)
//   fs.readdirSync(commandPath).forEach((dir) => {
  
//     // commands = fs.readdirSync(`${commandPath}/${dir}/`);
//     // console.log(commands);
//   });
};
