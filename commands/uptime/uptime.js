function uptime(client) {
  let days = Math.floor(client.uptime / 86400000);
  let hrs = Math.floor(client.uptime / 3600000) % 24;
  let minutes = Math.floor(client.uptime / 60000) % 60;
  let seconds = Math.floor(client.uptime / 1000) % 60;
  return `__Uptime:__\n${days}d ${hrs}h ${minutes}m ${seconds}s`;
}
const obj = {
  name: "Uptime",
  category: "Utility",
  description: "Uptime",
  run: async (client, message, args) => {
    message.channel.send(uptime(client));
  },
};
module.exports = obj;
