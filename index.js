const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField, 
  EmbedBuilder 
} = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===== CARREGAR AVISOS SALVOS =====
let avisos = {};
if (fs.existsSync('./warnings.json')) {
  avisos = JSON.parse(fs.readFileSync('./warnings.json'));
}

function salvarAvisos() {
  fs.writeFileSync('./warnings.json', JSON.stringify(avisos, null, 2));
}

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

// ===== BOAS VINDAS =====
client.on('guildMemberAdd', member => {
  const canal = member.guild.systemChannel;
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle("Bem-vindo!")
    .setDescription(`Olá ${member}, respeite as regras.`)
    .setColor("Green");

  canal.send({ embeds: [embed] });
});

// ===== COMANDOS =====
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const args = message.content.split(" ");
  const comando = args.shift()?.toLowerCase();

  // ===== AVISAR =====
  if (comando === "!avisar") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("Você não tem permissão.");
    }

    const membro = message.mentions.members.first();
    if (!membro) return message.reply("Marque um usuário.");

    if (!avisos[membro.id]) avisos[membro.id] = 0;
    avisos[membro.id]++;

    salvarAvisos();

    message.channel.send(`${membro} recebeu um aviso. Total: ${avisos[membro.id]}`);

    if (avisos[membro.id] >= 3) {
      await membro.kick();
      message.channel.send(`${membro.user.tag} foi expulso por excesso de avisos.`);
    }
  }

  // ===== VER AVISOS =====
  if (comando === "!avisos") {
    const membro = message.mentions.members.first() || message.member;
    const total = avisos[membro.id] || 0;

    message.channel.send(`${membro.user.tag} possui ${total} aviso(s).`);
  }

  // ===== BAN =====
  if (comando === "!ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("Você não tem permissão.");
    }

    const membro = message.mentions.members.first();
    if (!membro) return message.reply("Marque um usuário.");

    await membro.ban();
    message.channel.send(`${membro.user.tag} foi banido.`);
  }
});

client.login(process.env.TOKEN);
