const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const Punishments = require('../../util/Enums/Punishments.js')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid user - This user does not exist").send(message.channel);

    if(user.username == undefined) user = user.user;

    var filter = false;

    var type = "";

    if(args.length >= 2) {
        filter = false;
        type = args[1];
        let types = ["KICK", "UNKICK", "MUTE", "UNMUTE", "WARN", "UNWARN", "REPORT", "UNREPORT", "BAN", "UNBAN"];
        if(!types.includes(type.toUpperCase())) return new _NoticeEmbed(Colors.ERROR, "This punishment type does not exist").send();
    }

    let _user = new _User(user.id);

    let punishments = _user.getPunishments();

    punishments.filter(val => val.type.startsWith(type.toUpperCase()))

    var msg = "";

    if(punishments.length == 0) msg = "None";

    punishments.forEach(val => {
        msg += `\n${val.id} - ${val.type} - ${val.reason}`
        if(val.duration != '') msg += ` - ${val.duration}`
    })

    let embed = new Discord.RichEmbed()
        .setAuthor(`${user.username}'s History`)
        .setColor(Colors.INFO)
        .setDescription(msg);

    message.channel.send(embed);

}

module.exports.help = {
    name: "history",
    aliases: ["punishments"],
    permission: Groups.MOD,
    description: "Gives the moderation history of a user",
    usage: "history <user> [type]"
}