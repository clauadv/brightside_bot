import { globals } from "../utils/globals.js";
import { database } from "../utils/database.js";

export const handle_verify = async (message) => {
    if (message.channel.id != globals.channels.verify) return;

    await message.delete();

    if (!message.content.includes("-")) {
        await message.author.send(globals.logger.embed("Verify", "You didn't provide an order id.")).then(m => m.delete({ timeout: 20000 }));
        return;
    }

    await globals.shoppy.getSpecificOrder(message.content).then(data => { }).catch(items => {
        if (!items || !items.custom_fields || items.custom_fields.length <= 0) {
            message.author.send(globals.logger.embed("Verify", "You entered a wrong order id, be careful if you copied it well.")).then(m => m.delete({ timeout: 20000 }));
            globals.logger.error(`${message.author.tag} (${message.author.id}) entered a wrong order id`);
            return;
        }

        if (items.paid_at == null) {
            message.author.send(globals.logger.embed("Verify", "You entered an unpaid order id.")).then(m => m.delete({ timeout: 20000 }));
            globals.logger.error(`${message.author.tag} (${message.author.id}) entered an unpaid order id`);
            return;
        }

        // this isn't necessary if you don't have more products on your shoppy
        if (!(items.product_id == globals.products.bs_paypal || items.product_id == globals.products.bs_crypto)) {
            message.author.send(globals.logger.embed("Verify", "You entered an order id for a different product.")).then(m => m.delete({ timeout: 20000 }));
            globals.logger.error(`${message.author.tag} (${message.author.id}) entered an order id for a different product`);
            return;
        }

        database.query("SELECT id FROM users WHERE username = ? LIMIT 1", [items.custom_fields[0].value], async (error, response) => {
            if (error) globals.logger.error(error);

            if (response.length > 0) {
                message.author.send(globals.logger.embed("Verify", "You are already verified.")).then(m => m.delete({ timeout: 20000 }));
                return;
            }

            database.query("INSERT INTO users SET ?", { username: items.custom_fields[0].value, uid: items.custom_fields[1].value, discord: message.author.id, order_id: message.content }, async (error, response) => {
                if (error) globals.logger.error(error);

                let customer_role = message.member.guild.roles.cache.find(role => role.name === "brightside stable");
                message.member.roles.add(customer_role);

                globals.onetap.AddScriptSubscription(globals.logger, 2985, items.custom_fields[1].value);

                message.author.send(globals.logger.embed("Verify", "Thanks for buying brightside.\nBefore loading brightside, make sure to to download the font. To do that, type font in any channel and follow the instructions.\nIf you have any questions, open a ticket."));
                globals.logger.normal(`new user: ${items.custom_fields[0].value} (${items.custom_fields[1].value}) from ${items.agent.geo.country}`);
            });
        });
    });
};