const fs = require("node:fs");
const path = require("node:path");
const ascii = require("ascii-table");

const commands = path.join(__dirname, "../commands");

let table = new ascii(`${commands}`);
table.setHeading("Command", "Category", "Description", "Load status");

const read = (client) => {
  fs.readdirSync(commands).forEach((dir) => {
    const commandsContainer = `${commands}/${dir}/`;
    const commandsArray = fs
      .readdirSync(commandsContainer)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandsArray) {
      const pull = require(`${commandsContainer}/${file}`);
      const { name, category, description, run } = pull;
      if (name) cmdName = name.toString().toLowerCase();
      else cmdName = "";

      if (cmdName && category && description && run) {
        client.commands.set(cmdName, pull);
        table.addRow(cmdName, category, description, "✅");
      } else {
        table.addRow(cmdName);
        continue;
      }
    }
  });
  console.log(table.toString());
};

module.exports = read;
