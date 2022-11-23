module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  let prefix = client.botconfig.DefaultPrefix;

  let GuildDB = await client.GetGuild(message.guild.id);
  if (GuildDB && GuildDB.prefix) prefix = GuildDB.prefix;

  //Initialize GuildDB
  if (!GuildDB) {
    await client.database.guild.set(message.guild.id, {
      prefix: prefix,
      DJ: null,
    });
    GuildDB = await client.GetGuild(message.guild.id);
  }
  // bot mentioned
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    message.reply(`My prefix is \`${GuildDB.prefix}\``);
  }

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //Making the command lowerCase because our file name will be in lowerCase
  const command = args.shift().toLowerCase();

  //Searching a command
  const cmd =
    client.commands.get(command) ||
    client.commands.find((x) => x.aliases && x.aliases.includes(command));

  if (cmd) {
    // ||
    // (cmd.permissions &&
    //   GuildDB.DJ &&
    //   !message.channel
    //     .permissionsFor(message.member)
    //     .has(["ADMINISTRATOR"]) &&
    //   !message.member.roles.cache.has(GuildDB.DJ))

    if (
      // bot channel perms
      cmd.permissions &&
      cmd.permissions.channel &&
      !message.channel.permissionsFor(client.user).has(cmd.permissions.channel)
    ) {
      return client.sendError(
        message.channel,
        "Missing Permissions!"
          ? " Bot Missing Permissions: " + `${cmd.client.user}`
          : ""
      );
    }
    if (
      // member perms
      cmd.permissions &&
      cmd.permissions.member &&
      !message.channel
        .permissionsFor(message.member)
        .has(cmd.permissions.member)
    ) {
      return client.sendError(
        message.channel,
        "Missing Permissions!"
          ? " Member Missing Permissions: \r\n" + ` ${cmd.permissions.member}`
          : ""
      );
    }

    cmd.run(client, message, args, { GuildDB });
    client.CommandsRan++;
  } else return;
};
