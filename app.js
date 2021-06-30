import { database } from "./utils/database.js";
import { globals } from "./utils/globals.js";
import { controllers } from "./controllers/controllers.js";

database.connect(async (error) => {
    if (error) globals.logger.error(error);

    globals.logger.normal("mysql connected");
});

globals.client.on("ready", async () => {
    globals.logger.normal(`${globals.client.user.tag.substring(0, globals.client.user.tag.length - 5)} is online\n`);

    globals.client.user.setActivity("brightside community", { type: 'WATCHING' });
});

globals.client.on("message", async (message) => {
    const guild = globals.client.guilds.cache.get(globals.guild);
    if (!guild) return globals.logger.error("couldn't get the guild of the server");

    controllers.handle(message);
});

globals.client.login(process.env.token);
