console.clear();
const discord = require("discord.js");
const config = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const intents = [
  discord.GatewayIntentBits.Guilds,
  discord.GatewayIntentBits.GuildMessages,
  discord.GatewayIntentBits.MessageContent,
];

const client = new discord.Client({
  disableEveryone: false,
  intents,
});

const $PREFIX = config.default_prefix;
client.commands = new discord.Collection();

["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// on client ready
client.once(discord.Events.ClientReady, (c) => {
  console.log(`${c.user.tag} is Online!`);
  client.user.setPresence({
    activities: [
      {
        name: "with DISCORD.JS",
        type: discord.ActivityType.Playing,
      },
    ],
    status: "dnd",
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith($PREFIX)) return;

  // array of everything in the message but the prefix
  const argsArr = message.content
    .toLowerCase()
    .slice($PREFIX.length)
    .trim()
    .split(/ +/g);
  // the command (coming right after the prefix)

  const cmd = argsArr.shift().toLowerCase();
  console.log(cmd, argsArr);

  if (cmd.length === 0) return;
  let command = client.commands.get(cmd);
  if (command) {
    command.run(client, message, argsArr);
    console.log(command);
  }
  if (!command) console.log("Command Not Found");
  // bot mentioned
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    console.log(`${client.user.tag} was mentioned`);
    message.reply(`My prefix is \`${config.default_prefix}\``);
  }
});

client.login(process.env.TOKEN);
