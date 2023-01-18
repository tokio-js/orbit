const orbit = require("../src/lib");

const BUS = new orbit.Bus("Main");

class PlayerJoinEvent extends orbit.Event {
    name;
    constructor(name) {
        super("PlayerJoinEvent");
        this.name = name;
    }
}

PlayerJoinEvent.link(BUS)

BUS.on("PlayerJoinEvent", async event => {
    console.log("Player Joined: " + event.name);
});

BUS.on("PlayerJoinEvent", async () => {
    console.log("Another Player joined");
});


BUS.post(
    new PlayerJoinEvent("Bob")
);
