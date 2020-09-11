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

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a date (month/day/year)").send(message.channel);

    if(!checkDateFormat(args[1])) return new _NoticeEmbed(Colors.ERROR, "Invalid date - Please use this date format: month/day/year").send(message.channel);

    let dateArray = args[1].split("/");

    if(args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify a time of the day (hours:minutes)").send(message.channel);

    if(!checkTimeOfTheDay(args[2])) return new _NoticeEmbed(Colors.ERROR, "Invalid time format - Please use this time formate: hours:minutes");

    let timeArray = args[2].split(":");

    let date = new Date();

    date.setDate(parseInt(dateArray[1]));
    date.setMonth(parseInt(dateArray[0]) - 1);
    date.setFullYear(parseInt(dateArray[2]));

    date.setHours(parseInt(timeArray[0]));
    date.setMinutes(parseInt(timeArray[1]));

    match.setTime(date);

    return new _NoticeEmbed(Colors.SUCCESS, `You have successfully set the time of match #${id} to ${args[1]} ${args[2]}`).send(message.channel);

}

function checkDateFormat(string){

    let dateArray = string.split("/");

    if(dateArray.length != 3) return false;

    if(isNaN(dateArray[0]) || isNaN(dateArray[1]) || isNaN(dateArray[2])){
        return false;
    }

    if(parseInt(dateArray[1]) > 31) return false;

    if(parseInt(dateArray[0]) > 12) return false;

    return true;

}

function checkTimeOfTheDay(string){

    let timeArray = string.split(":");

    if(timeArray.length != 2) return false;

    if(isNaN(timeArray[0]) || isNaN(timeArray[1])) return false;

    if(parseInt(timeArray[0]) > 24) return false;

    if(parseInt(timeArray[1]) > 59) return false;

    return true;

}

module.exports.help = {
    name: "setmatchtime",
    aliases: ["set-match-time", "smt", "matchtime"],
    permission: Groups.MOD,
    description: "Sets the time of a match",
    usage: "setmatchtime <id> <date> <timeOfTheDay>"
}