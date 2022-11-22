module.exports = {
  "Admins": [process.env.OWNER_DOODER, process.env.OWNER_BACKUP], // Admins of the bot, I don't know what this do. -Darren.
  "DefaultPrefix": process.env.Prefix || "$", // Default prefix, Server Admins can change the prefix
  "Token": process.env.Token || "", // Discord Bot Token
  "ClientID": process.env.Discord_ClientID || "", // Discord Client ID
  "ClientSecret": process.env.Discord_ClientSecret || "", // Discord Client Secret
  // Spotify Integration, allows you to enter a spotify link.
  "Spotify": {
    ClientID: process.env.Spotify_ClientID || "", // Spotify Client ID
    ClientSecret: process.env.Spotify_ClientSecret || "", // Spotify Client Secret
  },
};
