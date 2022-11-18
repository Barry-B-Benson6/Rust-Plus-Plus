const RustPlus = require("@liamcottle/rustplus.js");
let {EmbedBuilder} = require('discord.js');

let connected;
let cargoOut = false;
let heliOut = false;

function CheckLoop(client, interaction){
    if (connected){
        let cargoOutCurrently = false
        let heliOutCurrently = false
        client.getMapMarkers((markers) => {
            console.log(markers.response.mapMarkers.markers);
            for (let i = 0; i < markers.response.mapMarkers.markers.length; i++){
                switch (markers.response.mapMarkers.markers[i].type){
                    case 5:
                        if (!cargoOut){
                            cargoOutCurrently = true;
                            let embed = new EmbedBuilder()
                            .setTitle('Cargo Ship')
                            .setDescription('Cargoship is coming get the mini ready')
                            .setColor(0x00AE86)
                            .setTimestamp()
                            interaction.channel.send({embeds: [embed]});
                            client.sendChatMessage(':: Cargo\'s out');
                        }
                        break;
                    case 8:
                            if (!heliOut){
                                heliOutCurrently = true;
                                let embed = new EmbedBuilder()
                                .setTitle('Heli')
                                .setDescription('Heli\'s coming get the m2\'s')
                                .setColor(0x00AE86)
                                .setTimestamp()
                                interaction.channel.send({embeds: [embed]});
                                client.sendChatMessage(':: Heli\'s out');
                            }
                        break;
                    default:
                        break;
                }
            }
            heliOut = heliOutCurrently;
            cargoOut = cargoOutCurrently;
        });
        setTimeout(CheckLoop, 5000, client, interaction);
    }
}

// enum AppMarkerType {
// 	Player = 1;
// 	Explosion = 2;
// 	VendingMachine = 3;
// 	CH47 = 4;
// 	CargoShip = 5;
// 	Crate = 6;
// 	GenericRadius = 7;
// }

module.exports = {
    Alerts : (serverIp, serverPort, playerId, playerToken, interaction) => {
        connected = false;
        let client = new RustPlus(serverIp, serverPort, playerId, playerToken, false);

        client.on("connected", () => {
            connected = true;
            console.log("Connected!");
            client.sendTeamMessage(":: Linked Alerts");

            let embed = new EmbedBuilder()
            .setTitle('Linking Rust Alerts')
            .setDescription('Check your team chat for a message saying "Linked Alerts"\n\rIf you want to unlink all you need to do is type !unlink-alerts in team chat')
            .setColor('#00ff00')
            .setTimestamp()
            interaction.reply({embeds: [embed], ephemeral: false});
            CheckLoop(client, interaction);
        });

        client.on('error', (error) => {
            console.log(error);
            interaction.reply({content: 'Unable to link (please ensure you provided the correcet information) \n\rIf you require help use /help-rust', ephemeral: true});
        });

        client.on("message", (message) => {
            if (message.broadcast) {
                if (message.broadcast.teamMessage.message.message === "!unlink-alerts"){
                    connected = false;
                    client.disconnect();
                    let embed = new EmbedBuilder()
                    .setTitle('Unlinked Rust Alerts')
                    .setDescription('You have unlinked your alerts')
                    .setColor('#ff0000')
                    .setTimestamp()
                    interaction.editReply({embeds: [embed], ephemeral: false});
                }
                console.log(message.broadcast.teamMessage.message.message);
            } 
        });

        client.connect();
    }
}