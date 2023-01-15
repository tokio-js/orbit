# Orbit

## Super fast event system for JS and TS

### [Examples](./examples/)

### Exmaple (TS)

```ts
import * as orbit from "orbitjs";

const BUS = new orbit.Bus("Main");

class PlayerJoinEvent extends orbit.Event {
    public name: string;
    constructor(name: string) {
        super("PlayerJoinEvent");
        this.name = name;
    }
}

PlayerJoinEvent.link(BUS)

BUS.on<PlayerJoinEvent>("PlayerJoinEvent", async event => {
    console.log("Player Joined: " + event.name);
});

BUS.on("PlayerJoinEvent", async () => {
    console.log("Another Player joined");
});


BUS.post(
    new PlayerJoinEvent("Bob")
);
```
