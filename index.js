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
