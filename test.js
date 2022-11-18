let RustClient = require('@liamcottle/rustplus.js');

let client = new RustClient("139.99.145.39", "28083", "76561198081697775", "-707171332",false);

client.on("message", (message) => {
    if (message.broadcast) {
        console.log(message.broadcast.teamMessage.message.name)
    }
});

client.on("connected", () => {
    console.log("Connected!");
    client.sendTeamMessage("Linked");
});

client.connect();