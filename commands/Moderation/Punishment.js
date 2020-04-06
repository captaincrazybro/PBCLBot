const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const Punishments = require('../../util/Enums/Punishments.js')
const punishments = require('../../storage/punishments.json');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a punishment id").send(message.channel);

    let id = args[0];

    let punishment = getPunishment(id);

    if(punishment == null) return new _NoticeEmbed(Colors.ERROR, "This punishment id does not exist").send(message.channel);

    var duration;

    if(punishment.duration == '') duration = "None";
    else duration = punishment.duration;

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor(`Punishment #${id}`)
        .setDescription(`
        **ID**: ${punishment.id}
        **Type**: ${punishment.type}
        **Date**: ${punishment.date}
        **Moderator**: <@${punishment.moderator}>
        **Reason**: ${punishment.reason}
        **Duration**: ${duration}`)
        .setTimestamp(new Date(punishment.date));

    message.channel.send(embed);

}

function getPunishment(id){

    let pmap = new Map(Object.entries(punishments));

    var outcome = null;

    pmap.forEach((v, k) => {
        if(k != "number") v.forEach(val => {
            if(val.id == id) outcome = val;
        })
    })

    return outcome

}

function getKeys(map){
    let arr = [];
    map.forEach((v, k) => arr.push(k))
    return arr;
}

module.exports.help = {
    name: "punishment",
    aliases: [""],
    permission: Groups.MOD,
    description: "Gives the details of a punishment",
    usage: "punishment <user> <id>"
}