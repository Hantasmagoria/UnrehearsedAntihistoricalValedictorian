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

  if (command === "quote") {
    console.log(
      "Initiated Quote command. \n",
      `${args[0] === "?" ? "" : "Quoting messageId " + args[0]} \n`,
      `sending to channel ${message.channel.name} in ${message.guild}`
    );
    const originalChannel = message.channel;
    if (args[0] === "?") {
      console.log("Quote command help requested at " + originalChannel);
      originalChannel.send("Example usage: ```>quote 645305062230589450 ```");
    } else if (typeof parseInt(args[0]) === "number") {
      const searchOtherChannels = () => {
        console.log("current server is " + message.guild);
        console.log("channel list: " + message.guild.channels);
        for (const channel in message.guild.channels) {
          const element = message.guild.channels[channel];
          console.log(element);
        }
      };

      originalChannel
        .fetchMessage(args[0])
        .then(message =>
          originalChannel.send(
            message.url,
            new Discord.RichEmbed()
              .setAuthor(message.author.username, message.author.avatarURL)
              .setColor(0xc736e5)
              .setDescription(message.content)
              .setTimestamp(message.createdTimestamp)
          )
        )
        .catch(error => {
          // console.log("errorcode = " + error.code);
          if (error.code == 10008) {
            searchOtherChannels();
          }
        });
    }
  }
});

client
  .login(`${process.env.BOT_TOKEN}`)
  .then(console.log("I am ready!"))
  .catch(console.error); //BOT_TOKEN set in heroku as a config var, setting already done. I think.
