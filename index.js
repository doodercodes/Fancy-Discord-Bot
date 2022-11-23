require("dotenv").config();
const { GatewayIntentBits } = require("discord.js");
const DiscordBot = require("./structures/DiscordBot");

const client = new DiscordBot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.build();
