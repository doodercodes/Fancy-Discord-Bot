const { Collection, Client, EmbedBuilder } = require("discord.js");
const Jsoning = require("jsoning");
const Logger = require("./Logger");
const fs = require("node:fs");
const path = require("node:path");
const ascii = require("ascii-table");

let table = new ascii(`Commands`);
table.setHeading("Command", "Category", "Description", "Load status");
class DiscordBot extends Client {
  constructor(props) {
    super(props);
    this.commands = new Collection();
    this.botconfig = require("../botconfig");
    this.logger = new Logger(path.join(__dirname, "..", "Logs.log"));
    this.database = {
      guild: new Jsoning("guild.json"),
    };

    this.loadCommands();
    this.LoadEvents();

    this.ws.on("INTERACTION_CREATE", async (interaction) => {
      let GuildDB = await this.GetGuild(interaction.guild_id);
      console.log(interaction);
      //Initialize GuildDB
      if (!GuildDB) {
        await this.database.guild.set(interaction.guild_id, {
          prefix: this.botconfig.DefaultPrefix,
          DJ: null,
        });
        GuildDB = await this.GetGuild(interaction.guild_id);
      }

      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;

      //Easy to send respnose so ;)
      interaction.guild = await this.guilds.fetch(interaction.guild_id);
      interaction.send = async (message) => {
        return await this.api
          .interactions(interaction.id, interaction.token)
          .callback.post({
            data: {
              type: 4,
              data:
                typeof message == "string"
                  ? { content: message }
                  : message.type && message.type === "rich"
                  ? { embeds: [message] }
                  : message,
            },
          });
      };

      let cmd = client.commands.get(command);
      if (cmd.SlashCommand && cmd.SlashCommand.run)
        cmd.SlashCommand.run(this, interaction, args, { GuildDB });
    });
  }
  loadCommands() {
    const CommandsDir = path.join(__dirname, "..", "commands");
    fs.readdir(CommandsDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          let cmd = require(CommandsDir + "/" + file);
          const { name, category, description, run } = cmd;
          const cmdName = file.split(".")[0].toLowerCase();
          //  console.log(name);

          if (!name || !category || !description || !run) {
            table.addRow(cmdName, "X", "X");
            return this.log(
              "Unable to load Command: " +
                file.split(".")[0] +
                ", Reason: File doesn't had run/name/description/category"
            );
          } else {
            table.addRow(cmdName, category, description);
            this.commands.set(cmdName, cmd);
            this.log("Command Loaded: " + file.split(".")[0]);
          }
        });
      console.log(table.toString());
    });
  }
  LoadEvents() {
    let EventsDir = path.join(__dirname, "..", "events");
    fs.readdir(EventsDir, (err, files) => {
      if (err) this.log(err);
      else
        files.forEach((file) => {
          const event = require(EventsDir + "/" + file);
          this.on(file.split(".")[0], event.bind(null, this));
          this.logger.log("Event Loaded: " + file.split(".")[0]);
        });
    });
  }
  async GetGuild(GuildID) {
    return new Promise(async (res, rej) => {
      let guild = await this.database.guild.get(GuildID);
      // .catch((err) => rej(err));
      res(guild);
    });
  }
  log(Text) {
    this.logger.log(Text);
  }
  sendError(Channel, Error) {
    let embed = new EmbedBuilder()
      .setTitle("An error occurred")
      .setColor("Red")
      .setDescription(Error)
      .setFooter({
        text: "If you think this as a bug, please report it in the support server!",
      });

    Channel.send({
      embeds: [embed],
    });
  }

  build() {
    this.login(this.botconfig.Token);
  }
}

module.exports = DiscordBot;
