const obj = {
  name: "Ping",
  category: `Utility`,
  description: "Pings the bot",
  run: async (client, message, args) => {
    message.reply("PONG!");
  },
};
module.exports = obj