# bot-discord-22
package.json
index.js
{
  "name": "bot-discord",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "discord.js": "^14.0.0"
  }
}
index.js
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log('Bot online!');
});

client.on('guildMemberAdd', member => {
  const canal = member.guild.systemChannel;
  if (canal) {
    canal.send(`Bem-vindo ${member}!`);
  }
});

client.login(process.env.TOKEN);
