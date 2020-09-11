const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
const players = require('../../storage/players.json');
const index = require('../../bot.js')
const _Match = require('../../util/Constructors/_Match.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.lenght == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a match id").send(message.channel);

    if(isNaN(args[0])) return new _NoticeEmbed(Colors.ERROR, "Invalid id - Id needs to be a number").send(message.channel);

    let id = parseInt(args[0]);

    let match = _Match.getMatchById(id);

    if(match == null) return new _NoticeEmbed(Colors.ERROR, "Invalid id - No matches are associated with that id").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a score (team1score-team2score)").send(message.channel);

    let scoreArray = args[1].split("-");

    if(scoreArray.length != 2) return new _NoticeEmbed(Colors.ERROR, "Invalid score - Please use this score format (team1score-team2score)").send(message.channel);

    if(isNaN(scoreArray[0])) return new _NoticeEmbed(Colors.ERROR, "Invalid score - Team 1 score needs to be a number").send(message.channel);

    if(isNaN(scoreArray[1])) return new _NoticeEmbed(Colors.ERROR, "Invalid score - Team 2 score needs to be a number").send(message.channel);

    let team1Score = parseInt(scoreArray[0]);
    let team2Score = parseInt(scoreArray[1]);

    match.setScore(team1Score, team2Score);

    return new _NoticeEmbed(Colors.SUCCESS, "You have successfully set the outcome of match #" + id + " to " + team1Score + "-" + team2Score).send(message.channel);

}

module.exports.help = {
    name: "setmatchscore",
    aliases: ["set-match-score", "sms", "matchscore"],
    permission: Groups.MOD,
    description: "Sets the score of a match",
    usage: "setmatchscore <id> <score (team1score-team2score)>"
}
 
