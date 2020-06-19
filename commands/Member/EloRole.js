const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
const players = require('../../storage/players.json');
const index = require('../../bot.js')

module.exports.run = async (bot,message,args,cmd) => {

    let eloRole = message.guild.roles.get('722554434474999849');

    if(!eloRole) {
        return new _NoticeEmbed(Colors.ERROR, "Error - The Elo role does not exist, please contact a staff member").send(message.channel);
    } else {
        if(message.guild.members.get(message.author.id).roles.has(eloRole.id)){
            message.guild.members.get(message.author.id).removeRole(eloRole);
            return new _NoticeEmbed(Colors.SUCCESS, "Your ELO role has been successfully removed").send(message.channel);
        } else {
            message.guild.members.get(message.author.id).addRole(eloRole);
            return new _NoticeEmbed(Colors.SUCCESS, "Your successfully received the ELO role").send(message.channel);
        }
    }

}

module.exports.help = {
    name: "elorole",
    aliases: ["elo-role", "elo-rank", "elorank"],
    permission: Groups.DEFAULT,
    description: "Toggles wether you have the elo rank",
    usage: "elorole"
}
 
