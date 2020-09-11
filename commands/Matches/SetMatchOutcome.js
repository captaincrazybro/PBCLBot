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

    if(match.date == null) return new _NoticeEmbed(Colors.ERROR, "The date of the match has not been set").send(message.channel);

    let botFile = require('../../bot.js');

    if(botFile.matchOutcomeMap.has(message.author.id)) return new _NoticeEmbed(Colors.ERROR, "You have already started the match outcome wizard").send(message.channel);

    botFile.matchOutcomeMap.set(message.author.id, {
        id: id,
        step: 0,
        score1: null,
        score2: null,
        team1Players: [],
        team2Players: [],
        team1: match.team1,
        team2: match.team2
    });

    new _NoticeEmbed(Colors.SUCCESS, `You have successfully entered the match outcome wizard! \nWhile in this match outcome wizard you can enter exist (exits the wizard) or back (goes back to the previous step) at any time.`).send(message.channel);

    new _NoticeEmbed(Colors.INFO, `\nPlease specify ${match.team1}'s score`).send(message.channel);

}

module.exports.help = {
    name: "setmatchoutcome",
    aliases: ["set-match-outcome", "smo", "matchoutcome", "recordmatchoutcome"],
    permission: Groups.MOD,
    description: "Starts the record match outcome wizard",
    usage: "setmatchoutcome <id>"
}
 
