const fs = require("node:fs");
const path = require("node:path");
const ascii = require("ascii-table");

const commandPath = path.join(__dirname, "../commands");
let table = new ascii(`${commandPath}`);
table.setHeading("Command", "Load status");

// console.log(`${commandPath}`);

module.exports = (client) => {
  fs.readdirSync(commandPath).forEach((dir) => {
    // if (condition) {}
    const cmds = `${commandPath}/${dir}/`;
    let commands = fs.readdirSync(cmds).filter((file) => file.endsWith(".js"));
    for (const file of commands) {
      let pull = require(`${cmds}/${file}`);
      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, "✅");
      } else {
        table.addRow(
          file,
          `❌  -> missing a help.name, or help.name is not a string.`
        );
        continue;
      }
    }
  });
  console.log(table.toString());
};
