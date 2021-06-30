import { globals } from "../utils/globals.js";
import { database } from "../utils/database.js";

export const handle_ban = async (message) => {
    if (message.author.id != globals.admins.clau) return;
    if (!message.content.startsWith(".ban")) return;

    const username = message.content.trim().split(/ +/g)[1];
    if (!username) {
        await message.reply(globals.logger.embed("Error", "You didn't provide an user.")).then(m => m.delete({ timeout: 20000 }));
        return;
    }

    await message.delete();

    database.query("SELECT uid FROM users WHERE username = ? LIMIT 1", [username], async (error, response) => {
        if (error) globals.logger.error(error);
        if (!response.length) {
            await message.reply(globals.logger.embed("Error", `No results found for user ***${username}***.`)).then(m => m.delete({ timeout: 20000 }));
            return;
        }

        await globals.onetap.DeleteScriptSubscription(globals.logger, 2985, response[0].uid);

        message.reply(globals.logger.embed("Ban", `User ***${username}*** has been banned.`)).then(m => m.delete({ timeout: 20000 }));
        globals.logger.error(`${username} (${response[0].uid}) has been banned`);

        // i know i should make another table for banned users but i like this way
        database.query("UPDATE users SET username = ? WHERE uid = ?", [`${username} (banned)`, response[0].uid], async (error, response) => {
            if (error) globals.logger.error(error);
        });
    });
}