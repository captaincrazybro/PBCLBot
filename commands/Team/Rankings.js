const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI')
const ranks = require('../../storage/ranks.json')
const teams = require('../../storage/teams.json')

module.exports.run = async (bot,message,args,cmd) => {

    var rankings = "";

    let teamsSorted = _Team.getTeamObj().sort((a, b) => { return a.losses - b.losses })

    teamsSorted.forEach(val => { 
        let index = teamsSorted.indexOf(val)
        rankings += `${val.losses}. ${val.name} - Tier ${val.wins}\n`
    })

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setTitle("Rankings")
        .setDescription(rankings);

    message.channel.send(embed);


    return;

}

module.exports.help = {
    name: "rankings",
    aliases: ["leaderboard"],
    permission: Groups.DEFAULT,
    description: "Gets the rankings",
    usage: "rankings"
}
