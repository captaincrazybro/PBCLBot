const _User = require('../../util/Constructors/_User');
const Discord = require('discord.js');
const Colors = require('../../util/Enums/Colors');
const Groups = require('../../util/Enums/Groups');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a user").send(message.channel);
    
    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(user.username == undefined) user = user.user;
    
    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid User - Please specify a valid user").send(message.channel);
    
    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a xp").send(message.channel);
    
    if(isNaN(args[1])) return new _NoticeEmbed(Colors.ERROR, "Invalid Number - Please specify a valid new xp").send(message.channel);
    
    let xp = parseInt(args[1]);
    
    let _user = new _User(user.id);
    
    _user.xp = xp;
    
    _user.updateEconomy();
    
    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`You have successfully set <@${user.id}>'s xp to ${xp}`)
        
    message.channel.send(embed);
    
}

module.exports.help = {
    name: "setxp",
    aliases: ["set-xp", "xp="],
    permission: Groups.MOD,
    description: "Sets the xp of a user",
    usage: "setxp <user> <xp>"
}