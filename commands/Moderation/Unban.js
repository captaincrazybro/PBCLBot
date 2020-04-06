const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const Punishments = require('../../util/Enums/Punishments.js')
const ms = require('ms');

module.exports.run = async (bot,message,args,cmd) => {

    var logsEnabled

    if(!settings.logsChannelId || settings.logsChannelId == '' || settings.logsChannelId.toLowerCase() == 'false'){
        logsEnabled = false;
    } else {
        logsEnabled = true;
    }

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid user - This user does not exist").send(message.channel);

    if(user.username == undefined) user = user.user;

    var reason = 'No Reason';

    if(args.length >= 2){
        var argss = args;
        argss.shift()
        argss.shift()
        reason = argss.join(" ");
    }

    if(message.guild.members.get(user.id)) return new _NoticeEmbed(Colors.ERROR, "This user is not banned").send(message.channel);

    message.guild.unban(user);

    let _user = new _User(user.id);

    let obj = _user.addPunishment(Punishments.UNBAN, message.author.id, reason);

    var msg;

    if(reason == 'No Reason'){
        msg = `<@${user.id}> has been warned by <@${message.author.id}>`;
    } else {
        msg = `<@${user.id}> has been warned by <@${message.author.id}> for ${reason} for ${duration}`
    }

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(msg);

    message.channel.send(embed);

    if(logsEnabled){
        let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
        let logEmbed = new Discord.RichEmbed()
            .setColor('ORANGE')
            .setAuthor('Mute')
            .setDescription(`
            **Punishment ID**: ${obj.id}
            **User**: <@${user.id}>
            **Moderator**: <@${message.author.id}>
            **Reason**: ${reason}
            **Duration**: ${duration}`)
            .setTimestamp(new Date())
            .setThumbnail(user.avatarURL);
        channel.send(logEmbed);
    }

}

module.exports.help = {
    name: "unban",
    aliases: [""],
    permission: Groups.MOD,
    description: "Unbans a user",
    usage: "unban <user> [reason]"
}