const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
const players = require('../../storage/players.json');
const index = require('../../bot.js')
const _Team = require('../../util/Constructors/_Team.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify the first team").send(message.channel);

    let team1 = _Team.getTeam(args[0]);

    if(team1 == null) return new _NoticeEmbed(Colors.ERROR, "Invalid first team - Please specify an existing team").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a second team").send(message.channel);

    let team2 = _Team.getTeam(args1);

    if(team2 == null) return new _NoticeEmbed(Colors.ERROR, "Invalid second team - Please specify an existing team").send(message.channel);

    if(args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify a date (month/day/year)").send(message.channel);

    if(!checkDateFormat(args[2])) return new _NoticeEmbed(Colors.ERROR, "Invalid date - Please specify a valid date (month/day/year)").send(message.channel);

    if(args.length == 3) return new _NoticeEmbed(Colors.WARN, "Please specify a time of the day (Military time)").send(message.channel);

    if(!checkTimeOfTheDay(args[3])) return new _NoticeEmbed(Colors.ERROR, "Invalid time of the day - Please specify a valid time of the day (hours:minutes, Military time)")

    let date = new Date();
    let dateArray = args[2].split("/");

    date.setDate(parseInt(dateArray[1]));
    date.setMonth(parseInt(dateArray[0]));
    date.setFullYear(parseInt(dateArray[2]));

    let timeArray = args[3].split(":");

    date.setHours(parseInt(timeArray[0]));
    date.setMinutes(parseInt(timeArray[1]));

    let match = _Match.createMatch(team1.getName(), team2.getName(), null, null, date);

    return new _NoticeEmbed(Colors.SUCCESS, "You have successfully scheduled a match between " + team1.name + " and " + team2.name + " to take place at " + date.toString()).send(message.channel);

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
    name: "schedulematch",
    aliases: ["schedule-match", "sm"],
    permission: Groups.MOD,
    description: "Schedules a match",
    usage: "schedulematch <team1> <team2> <date (month/day/year)> <timeOfTheDay (hours:minutes)>"
}