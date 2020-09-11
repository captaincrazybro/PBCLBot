const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
const players = require('../../storage/players.json');
const index = require('../../bot.js')
const _Match = require('../../util/Constructors/_Match.js');
const _MinecaftAPI = require('../../util/Constructors/_MinecraftAPI');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.lenght == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a match id").send(message.channel);

    if(isNaN(args[0])) return new _NoticeEmbed(Colors.ERROR, "Invalid id - Id needs to be a number").send(message.channel);

    let id = parseInt(args[0]);

    let match = _Match.getMatchById(id);

    if(match == null) return new _NoticeEmbed(Colors.ERROR, "Invalid id - No matches are associated with that id").send(message.channel);

    let scoreString = "TBD";
    let dateString = "TBD";
    let team1Players = "TBD";
    let team2Players = "TBD";

    if(match.score1 != null && match.score2 != null) scoreString = `${match.score1}-${match.score2}`
    if(match.date != null) {
        let date = new Date(match.date);
        let minutes = ""
        if(date.getMinutes() < 10) minutes = `0${date.getMinutes()}`;
        else minutes = `${date.getMinutes()}`;
        dateString = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${minutes}`;
    }

    if(match.team1Players.length > 0){
        match.team1Players.forEach(val => {
            team1Players += `${val.id} - ${val.kills/val.deaths}\n`
        })
    }
    if(match.team2Players.length > 0){
        match.team2Players.forEach(val => {
            team2Players += `${val.id} - ${val.kills/val.deaths}\n`
        })
    }

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Match #" + id)
        .addField("Team 1", match.team1)
        .addField("Team 2", match.team2)
        .addField("Score", scoreString)
        .addField("Date", dateString)
        .addField(`${match.team1}'s Players`, team1Players)
        .addField(`${match.team2}'s Players`, team2Players)
        .addField("Referee", `<@${match.ref}>`)
        .addField("Host", `<@${match.host}>`)
        .addField("Host IGN", match.hostMc)
        .addField("Media", `<@${match.media}>`)
        .addField("Season", match.season)

    message.channel.send(embed);

}

module.exports.help = {
    name: "getmatch",
    aliases: ["get-match", "gm", "match"],
    permission: Groups.DEFAULT,
    description: "Gets you the details about a specified match",
    usage: "getmatch <team1> [team2] OR getmatch <date>"
}
 
