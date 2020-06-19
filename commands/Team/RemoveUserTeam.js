const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const _Team = require('../../util/Constructors/_Team');
const MySQL = require('../../MySQL');
const userTeams = require('../../storage/userteams.json');

module.exports.run = async(bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a role or user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(user != null) if(user.username == undefined) user = user.user;

    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid role or user (mention or id)").send(message.channel);
    
    let conn = MySQL.getConnection();
    
    if(getUser(user.id) == null){
        return new _NoticeEmbed(Colors.ERROR, "This user does not have a team").send(message.channel);
    } else {
        let teamRole = message.guild.roles.find('name', `${result[0].team}`);
        if(teamRole && message.guild.members.get(user.id).roles.find('id', teamRole.id)){
            message.guild.members.get(user.id).removeRole(teamRole);
        }
        delete userTeams[getUserIndex(user.id)];
    }

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`Successfully removed <@${user.id}>'s team`)

    message.channel.send(embed);

}

function getUser(id){
    let index = userTeams.findIndex(val => val.id == id);
    if(!index) return null;
    else return userTeams[index];
}

function getUserIndex(id){
    let index = userTeams.findIndex(val => val.id == id);
    if(!index) return null;
    else return index;
}


module.exports.help = {
    name: "removeuserteam",
    aliases: ["remove-user-team"],
    permission: Groups.MOD,
    description: "Removes a user's team",
    usage: "removeuserteam <user>"
}