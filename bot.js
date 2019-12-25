const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
client.config = config;

client.on("message", message => {
  let prefix = client.config.prefix;
  let args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  let command = args.shift().toLowerCase();

  // Quote Command
  if (command === "quote") {
    // console.log(
    //   "Initiated Quote command. \n",
    //   `${args[0] === "?" ? "" : "Quoting messageId " + args[0]} \n`,
    //   `sending to channel ${message.channel.name} in ${message.guild}`
    // );
    if (args[0] === "?") {
      // console.log("Quote command help requested at " + message.channel);
      message.channel.send("Example usage: ```>quote 645305062230589450 ```");
    } else if (typeof parseInt(args[0]) === "number") {
      let originchannel = message.channel;
      for (const channelIdentifier in message.guild) {
        if (message.guild.hasOwnProperty(channelIdentifier)) {
          const channelOne = message.guild[channelIdentifier];
          channelOne
            .fetchMessage(args[0])
            .then(
              originchannel.send(
                new Discord.RichEmbed()
                  .setTitle("Quote from " + message.author.username)
                  .setAuthor(message.author.username, message.author.avatarURL)
                  .setColor(0xc736e5)
                  .setDescription(message.content)
                  .setTimestamp(message.createdTimestamp)
              )
            )
            .catch(console.error);
        }
      }

      // // Deprecating:
      // if (message.channel == 0) {
      //   message.channel
      //     .fetchMessage(args[0])
      //     .then(message =>
      //       message.channel.send(
      //         new Discord.RichEmbed()
      //           .setTitle("Quote from " + message.author.username)
      //           .setAuthor(message.author.username, message.author.avatarURL)
      //           .setColor(0xc736e5)
      //           .setDescription(message.content)
      //           .setTimestamp(message.createdTimestamp)
      //         // .setURL(message.url) removed to see if the link is still there
      //       )
      //     )
      // }
    }
  }
});

client
  .login(`${process.env.BOT_TOKEN}`)
  .then(console.log("I am ready!"))
  .catch(console.error);
