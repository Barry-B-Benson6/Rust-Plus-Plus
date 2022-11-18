const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
let Discord = require('discord.js');
let client = new Discord.Client({ intents: ['GuildMessages', 'Guilds','MessageContent'] });
const dotenv = require('dotenv');
dotenv.config();

let { Alerts } = require('./alerts.js');
let { ChatLink } = require('./chat.js');

// var LinkCommand = new SlashCommandBuilder()
// .setName('link-alerts')
// .setDescription('get notifications when heli or cargo comes out (use /help-rust for more info)')
// .addStringOption(option => option.setName('server-ip').setDescription('The ip for the server you want to get alerts from').setRequired(true))
// .addStringOption(option => option.setName('server-port').setDescription('The port for the server you want to get alerts from').setRequired(true))
// .addStringOption(option => option.setName('player-id').setDescription('Your player id').setRequired(true))
// .addStringOption(option => option.setName('player-token').setDescription('Your rust+ token').setRequired(true))

// var LinkCommand = new SlashCommandBuilder()
// .setName('link-chat')
// .setDescription('link ingame chat to discord (use /help-rust for more info)')
// .addStringOption(option => option.setName('server-ip').setDescription('The ip for the server you want to get alerts from').setRequired(true))
// .addStringOption(option => option.setName('server-port').setDescription('The port for the server you want to get alerts from').setRequired(true))
// .addStringOption(option => option.setName('player-id').setDescription('Your player id').setRequired(true))
// .addStringOption(option => option.setName('player-token').setDescription('Your rust+ token').setRequired(true))

// var HelpCommand = new SlashCommandBuilder()
// .setName('help-rust')
// .setDescription('Get help with rust commands')

client.on('ready', () => {
    console.log('I am ready!');
    let commands = client.application?.commands
    //commands?.create(LinkCommand)
    // commands?.set([LinkCommand.toJSON()])
});

let ChatChannels = new Map();

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (ChatChannels.has(message.channel)){
        console.log(message);
        ChatChannels.get(message.channel).sendTeamMessage(":: " + message.author.username + ": " + message.content);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()){
        if (interaction.commandName === 'link-alerts'){
            let serverIp = interaction.options.getString('server-ip');
            let serverPort = interaction.options.getString('server-port');
            let playerId = interaction.options.getString('player-id');
            let playerToken = interaction.options.getString('player-token');
            Alerts(serverIp, serverPort, playerId, playerToken,interaction);
        }
        if (interaction.commandName === 'link-chat'){
            let serverIp = interaction.options.getString('server-ip');
            let serverPort = interaction.options.getString('server-port');
            let playerId = interaction.options.getString('player-id');
            let playerToken = interaction.options.getString('player-token');
            ChatLink(serverIp, serverPort, playerId, playerToken,interaction, ChatChannels);
        }
        if (interaction.commandName === 'help-rust'){
            let embed = new EmbedBuilder()
            .setTitle('Rust++ Help')
            .setDescription('how to get the information required to use the commands of this bot')
            .setFields([
                { name: 'Ensure you have nodejs installed', value: 'https://nodejs.org/en/ make sure you download the LTS version'},
                { name: 'Open a command prompt terminal', value: 'Press the windows key and type "cmd" and press enter'},
                { name: 'Login', value: 'Type "npx @liamcottle/rustplus.js fcm-register" and press enter'},
                { name: 'Pair your server', value: 'Type "npx @liamcottle/rustplus.js fcm-listen" and press enter\n\rThen open rust and join your server and press pair'},
                { name: 'Get your info', value: 'Copy the info from the terminal'},
            ])
            .setColor('#00ff00')
            .setTimestamp()
            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
});

client.login(process.env.TOKEN);     