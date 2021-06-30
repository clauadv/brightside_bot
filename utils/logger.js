import chalk from "chalk";
import discord from "discord.js";

export const logger = {
    normal: (message) => console.log(chalk.white("*"), chalk.cyan("brightside"), chalk.white(`- ${message}`)),
    error: (message) => console.log(chalk.white("*"), chalk.red("brightside"), chalk.white(`- ${message}`)),
    embed: (type, message) => new discord.MessageEmbed().setAuthor(type, "https://cdn.discordapp.com/icons/800476661254193157/60bb1208d2d1cfacbbf449bf80304e00.png","https://brightside.technology").setColor(0x83cbff).setDescription(message),
};