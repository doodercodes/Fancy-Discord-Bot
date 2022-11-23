const { ActivityType } = require("discord.js");

module.exports = async (client, message) => {
  const presence = client.botconfig.Presence;
  client.logReady(`${client.user.tag} LOGGED ON!!`);
  client.user.setStatus(presence.status);
  client.user.setActivity(presence.name, {
    type: ActivityType[presence.type],
  });
};
