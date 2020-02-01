const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const ytToken = process.env.BOT_YOUTUBE_TOKEN;

client.on("error", console.error);

client.music = require("discord.js-musicbot-addon");

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
    const originalChannel = message.channel;
    const sEmbed = msg => {
      if (!msg.content) {
        return;
      }
      message.delete().catch(console.error);
      originalChannel.send(
        msg.url,
        new Discord.RichEmbed()
          .setAuthor(msg.author.username, msg.author.avatarURL)
          .setColor(0xc736e5)
          .setDescription(msg.content)
          .setTimestamp(msg.createdTimestamp)
      );
    };

    if (args[0] === "?") {
      originalChannel.send("Example usage: ```>quote 645305062230589450 ```");
    } else if (typeof parseInt(args[0]) === "number") {
      const searchOtherChannels = () => {
        let channelist = [];

        message.guild.channels.map(_channel => {
          channelist.push(_channel.id);
        });

        for (i = 0; i < channelist.length; i++) {
          findchannel = client.channels.get(channelist[i]);
          if (findchannel && findchannel.type == "text") {
            findchannel
              .fetchMessage(args[0])
              .then(fetchedmsg => {
                sEmbed(fetchedmsg);
              })
              .catch(error => {
                return error.code;
              });
          }
        }
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

client.music.start(client, {
  youtubekey: `${ytToken}`,
  botPrefix: `${config.prefix}`,
  anyoneCanSkip: true,
  cooldown: {
    enabled: false
  }
});

client
  .login(`${process.env.BOT_TOKEN}`)
  .then(console.log("I am ready! " + "Youtube token = " + ytToken))
  .catch(console.error);
