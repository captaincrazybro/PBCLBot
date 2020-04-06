const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const Punishments = require('../../util/Enums/Punishments.js')

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

    if(args.length == 1) {

        let _user = new _User(user.id);
        let obj = _user.removePunishment(Punishments.WARN, message.author.id);

        if(!obj) return new _NoticeEmbed(Colors.ERROR, "You have not issued any warnings to this user").send(message.channel);
    
        let embed = new Discord.RichEmbed()
            .setColor(Colors.SUCCESS)
            .setDescription(`<@${user.id}>'s last warning was removed`);
    
        message.channel.send(embed).then(m => {
            message.delete().catch(O_o=>{});
            m.delete(5000);
        });
    
        if(logsEnabled) {
            let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
            let logEmbed = new Discord.RichEmbed()
                .setColor('DARK_GREEN')
                .setAuthor('Unwarn')
                .setDescription(`
                **User**: <@${user.id}>
                **Moderator**: <@${message.author.id}>
                **Original Punishment ID: ${obj.id}
                **Original Moderator**: ${obj.moderator}
                **Original Date**: ${obj.date}
                **Original Reason**: ${obj.reason}`)
                .setTimestamp(new Date().toDateString());
            
            channel.send(logEmbed);
    
        } 

    } else {

        let moderator = message.guild.members.get(args[1]);

        if(!moderator) return new _NoticeEmbed(Colors.ERROR, "Invalid Moderator - Specify a valid moderator").send(message.channel);

        let _user = new _User(user.id);
        let obj = _user.removePunishment(Punishments.WARN, moderator.id);

        if(!obj) return new _NoticeEmbed(Colors.ERROR, "This user does not have any warnings from this moderator").send(message.channel);

        let embed = new Discord.RichEmbed()
            .setColor(Colors.SUCCESS)
            .setDescription(`<@${user.id}>'s last warning was removed`);

        message.channel.send(embed).then(m => {
            message.delete().catch(O_o=>{});
            m.delete(5000);
        });

        if(logsEnabled) {
            let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
            let logEmbed = new Discord.RichEmbed()
                .setColor('DARK_GREEN')
                .setAuthor('Unwarn')
                .setDescription(`
                **User**: <@${user.id}>
                **Moderator**: <@${message.author.id}
                **Original Moderator**: ${obj.moderator}
                **Original Date**: ${obj.date}
                **Original Reason**: ${obj.reason}`)
                .setTimestamp(new Date());
            
            channel.send(logEmbed);

        }

    }

}

module.exports.help = {
    name: "unwarn",
    aliases: ["removewarn", "remwarn", "rem-warn", "remove-warn"],
    permission: Groups.MOD,
    description: "Unwarns a user",
    usage: "unwarn <user> [moderatorId]"
}