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

      if (pull.name && pull.category && pull.description && pull.run) {
        client.commands.set(pull.name, pull);
        table.addRow(file, pull.category, pull.description, "✅");
      } else {
        table.addRow(file, `❌`);
        continue;
      }
    }
  });
  console.log(table.toString());
};

module.exports = read;
