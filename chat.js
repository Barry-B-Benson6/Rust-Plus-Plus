let {EmbedBuilder} = require('discord.js');
let RustClient = require('@liamcottle/rustplus.js');

module.exports = {
    ChatLink : (serverIp, serverPort, playerId, playerToken, interaction, ChatChannels) => {
        if (ChatChannels.has(interaction.channel)){
            interaction.reply("A Chat already been linked to this channel");
            return;
        }
        let client = new RustClient(serverIp, serverPort, playerId, playerToken,false);
        client.on("message", (message) => {
            if (message.broadcast) {
                try{
                    let content = message.broadcast.teamMessage.message.message
                    let name = message.broadcast.teamMessage.message.name
                    console.log(name + ": " + content)
                    if (content.startsWith("!unlink-chat")){
                        client.disconnect();
                        let embed = new EmbedBuilder()
                        .setTitle('Unlinked Rust Chat')
                        .setDescription('You have unlinked your chat')
                        .setColor('#ff0000')
                        .setTimestamp()
                        interaction.editReply({embeds: [embed], ephemeral: false});
                    } else{
                        if (!content.startsWith("::")){
                            interaction.channel.send(name + ": " + content);
                        }
                    }
                }catch{}
            }    
        });

        client.on("connected", () => {
            console.log("Connected!");
            client.sendTeamMessage(":: Linked Chat");
        })
        client.connect();
        ChatChannels.set(interaction.channel, client);
        let embed = new EmbedBuilder()
        .setTitle('Rust++ Chat Link')
        .setDescription('Chat link has been enabled for this channel\n\rYou can now chat in game and it will be sent to this channel and vice versa')
        interaction.reply({embeds: [embed], ephemeral: false});
    }
}