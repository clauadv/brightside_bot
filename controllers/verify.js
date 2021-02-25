const database = require("../utils/database");
const logger = require("../utils/logger")
const dotenv = require("dotenv").config({ path: "./.env" })
const shoppy = require("shoppy.gg")
const shoppy_api = new shoppy.API(process.env.shoppy);
const onetap = require("../utils/api");
const onetap_api = new onetap(process.env.api_id, process.env.api_secret, process.env.api_key);

exports.do = async (message) => {
    if (message.channel.id === "channel id") {
        if (message.content.startsWith(".verify")) {
            const args = message.content.trim().split(/ +/g);

            await message.delete();

            await shoppy_api.getSpecificOrder(args[1]).then(data => { }).catch(items => {
                if (items.custom_fields === undefined || !(items.custom_fields[0].value || items.custom_fields[1].value)) {
                    logger.error(`user: ${message.author.tag} (${message.author.id}) tried to verify but his order id was incorrect`)

                    return message.author.send(logger.log_embedded("ERROR", "Your order id is incorrect, be careful if you copied it well.")).then(m => m.delete({ timeout: 20000 }));
                }

                if (items.paid_at === null || !items.product_id === 'product id' || items.confirmations !== 1 || items.delivered !== 1)
                    return logger.error(`user: ${message.author.tag} (${message.author.id}) tried to verify with an unpaid order id`);

                database.query("SELECT id FROM users WHERE username = ? LIMIT 1", [items.custom_fields[0].value], async (err, res) => {
                    if (err)
                        return logger.error(err);

                    if (res.length > 0) {
                        logger.error(`user: ${message.author.tag} (${message.author.id}) tried to verify | ${JSON.stringify(res)}`);

                        return await message.author.send(logger.log_embedded("ERROR", "You are already verified")).then(m => m.delete({ timeout: 20000 }));
                    }

                    database.query("INSERT INTO users SET ?", { username: items.custom_fields[0].value, uid: items.custom_fields[1].value, discord: message.author.id, order_id: args[1] }, async (err, res) => {
                        if (err)
                            return logger.error(err);

                        let customer_role = message.member.guild.roles.cache.find(role => role.name === "brightside onetap")
                        message.member.roles.add(customer_role);

                        logger.log(`user: ${items.custom_fields[0].value} | uid: ${items.custom_fields[1].value} | ${message.author.tag} (${message.author.id})`);
                        await onetap_api.AddScriptSubscription(logger, 0, items.custom_fields[1].value);
                    });
                });
            });
        } else
            await message.delete();
    }
};