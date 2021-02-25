const discord = require("discord.js");
const client = new discord.Client();

const database = require("./utils/database");
const logger = require("./utils/logger");

const verify = require("./controllers/verify");

database.connect(async (err) => {
    if (err)
        logger.error(err);

    logger.log("mysql is connected")
});

client.on("ready", async () => {
    logger.log("the bot is online \n");

    client.user.setActivity("brightside javascript", { type: 'WATCHING' });
});

client.on("message", async (message) => {
    const guild = client.guilds.cache.get("discord server");
    if (!guild)
        return logger.error("can't get the guild of the server");

    verify.do(message);
});

client.login(process.env.token);