import onetap from "../utils/api.js";
import discord from "discord.js";
import shoppy from "shoppy.gg";
import { logger } from "./logger.js";

export const globals = {
    client: new discord.Client(),
    onetap: new onetap(process.env.onetap),
    shoppy: new shoppy.API(process.env.shoppy),

    guild: "",

    logger: {
        normal: logger.normal,
        error: logger.error,
        embed: logger.embed
    },

    products: {
        bs_paypal: "",
        bs_crypto: "",
    },
    
    channels: {
        verify: ""
    },

    admins: {
        clau: "244530662906789889"
    },
};