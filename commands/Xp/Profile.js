const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a role or user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid user - This user does not exist").send(message.channel);

    if(user.username == undefined) user = user.user;

    let _user = new _User(user.id);

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setTitle(`${user.username}'s Profile`)
        .addField("XP", _user.xp)
        .addField("Level", _user.getLevel())

    message.channel.send(embed);

}

module.exports.help = {
    name: "profile",
    aliases: [""],
    permission: Groups.MOD,
    description: "Gets the profile of a member",
    usage: "profile <user>"
}