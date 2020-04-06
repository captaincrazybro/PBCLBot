const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js')

module.exports.run = async (bot,message,args,cmd) => {

    let teams = _Team.getTeams();

    if(teams.length == 0) return new _NoticeEmbed(Colors.ERROR, "There are currently no teams").send(message.channel);

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setTitle("Teams")

    teams.forEach(val => {
        embed.addField(val.name, `${val.getMembers().length} Members`)
    })

    message.channel.send(embed);

}

module.exports.help = {
    name: "listteams",
    aliases: ["teams", "list-teams"],
    permission: Groups.DEFAULT,
    description: "Lists the teams",
    usage: "listteams"
}