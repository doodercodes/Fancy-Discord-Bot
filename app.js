const discord = require("discord.js");
const config = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const $PREFIX = config.default_prefix;

const intents = [
  discord.GatewayIntentBits.Guilds,
  discord.GatewayIntentBits.GuildMessages,
  discord.GatewayIntentBits.MessageContent,
];

const client = new discord.Client({
  disableEveryone: false,
  intents,
});

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
  // console.log(
  //   `${client.user.tag} has picked up a message sent to the server: \n"${message.content}"`
  // );

  // array of everything in the message but the prefix
  const args = message.content.slice($PREFIX.length).trim().split(/ +/g);
  // the command (coming right after the prefix)
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);

  if (command) command.run(client, message, args);

  // bot mentioned
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    console.log(`${client.user.tag} was mentioned`);
    message.reply(`My prefix is \`${config.default_prefix}\``);
  }
});

client.login(process.env.TOKEN);
