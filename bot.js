const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("error", console.error);

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  let prefix = config.prefix;
  let args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  let command = args.shift().toLowerCase();

  if (command === "quote") {
    // console.log(
    //   "Initiated Quote command. \n",
    //   `${args[0] === "?" ? "" : "Quoting messageId " + args[0]} \n`,
    //   `sending to channel ${message.channel.name} in ${message.guild}`
    // );

    const originalChannel = message.channel;
    const sEmbed = msg => {
      if (!msg.content) {
        return;
      }
      originalChannel.send(
        msg.url
        // ,
        // new Discord.RichEmbed()
        //   .setAuthor(msg.author.username, msg.author.avatarURL)
        //   .setColor(0xc736e5)
        //   .setDescription(msg.content)
        //   .setTimestamp(msg.createdTimestamp)
      );
    };

    if (args[0] === "?") {
      console.log("Quote command help requested at " + originalChannel);
      originalChannel.send("Example usage: ```>quote 645305062230589450 ```");
    } else if (typeof parseInt(args[0]) === "number") {
      const searchOtherChannels = () => {
        // console.log("current server is " + message.guild);
        // This console.log works:
        // console.log(message.guild.channels.array());
        let channelist = [];

        message.guild.channels.map(_channel => {
          channelist.push(_channel.id);
        });

        // console.log(channelist);
        console.log(client.channels.array());
        for (i = 0; i < channelist.length; i++) {
          msg = client.channels
            .find("id", channelist[i])
            .fetchMessage(args[0])
            .catch(error => {
              return error.code == 10008
                ? console.log("not found in " + channelist[i])
                : error.code;
            });
          sEmbed(msg);
        }
        // message.guild.channels.map(_channel => {
        //   const fetched = _channel.fetchMessage(args[0]).catch(error => {
        //     return error.code == 10008
        //       ? console.log("not found in " + _channel.name)
        //       : error.code;
        //   });
        //   sEmbed(fetched);
        // });
      };

      originalChannel
        .fetchMessage(args[0])
        .then(message => sEmbed(message))
        .catch(error => {
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
  .catch(console.error);
