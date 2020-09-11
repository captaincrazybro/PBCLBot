const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
const players = require('../../storage/players.json');
const index = require('../../bot.js');
const _Team = require('../../util/Constructors/_Team');
const _Match = require('../../util/Constructors/_Match');
const { match } = require('assert');

module.exports.run = async (bot,message,args,cmd) => {

    let team1Check = false;

    let team1 = null;

    if(args.length > 0){

        team1 = _Team.getTeam(args[0]);

        if(team1 == null) return new _NoticeEmbed(Colors.ERROR, "Invalid first team - Please specify an existing team").send(message.channel);

        team1Check = true;
    
    }

    let filtered = _Match.getMatchesObj();

    let date = new Date();

    let minutes = (date.getMinutes() + 1) + 60 * date.getHours() * date.getDate() * date.getMonth() * (date.getFullYear() - 2000);

    filtered = filtered.filter(val => val.minutes > minutes);

    if(team1) filtered = filtered.filter(val => val.team1 == team1.name || val.team2 == team1.name);

    let description = "";

    filtered.forEach((val, i) => {
        description += `${val.team1} vs ${val.team2}, Score: ${val.score1}-${val.score2}, ID: ${i}`;
    })

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Upcoming Matches")
        .setDescription(description);

    message.channel.send(embed);

}

module.exports.help = {
    name: "upcomingmatches",
    aliases: ["upcoming-matches", "um", "upcoming"],
    permission: Groups.DEFAULT,
    description: "Lists the upcoming matches",
    usage: "listmatches [team]"
}