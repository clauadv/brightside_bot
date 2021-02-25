const chalk = require("chalk");
const discord = require("discord.js");

exports.log = (message) => {
    if (message === undefined)
        throw new Error("message parameter can't be empty!");

    return console.log(chalk.white("("), chalk.cyan("brightside system"), chalk.white(")"), chalk.white(message));
}

exports.error = (message) => {
    if (message === undefined)
        throw new Error("message parameter can't be empty!");

    return console.log(chalk.white("("), chalk.red("brightside system"), chalk.white(")"), chalk.white(message));
}

exports.log_embedded = (type, message) => {
    if (type === undefined || message === undefined)
        throw new Error("type/message parameter can't be empty!");

    return new discord.MessageEmbed().setColor("#83cbff").setTitle(type).setDescription(message);
}