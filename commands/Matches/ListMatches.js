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
    let team2Check = false;
    let dateCheck = false;

    let team1 = null;
    let team2 = null;

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a filter (team or date)").send(message.channel);

    if(args[0].split("/").length == 3){
        if(!checkDateFormat(args[0])) return new _NoticeEmbed(Colors.ERROR, "Invalid date - Please specify a valid date (date/month/year)").send(message.channel);
        dateCheck = true;
    } else {

        //team1 = _Team.getTeam(args[0]);

        //if(team1 == null) return new _NoticeEmbed(Colors.ERROR, "Invalid first team - Please specify an existing team").send(message.channel);

        team1Check = true;
    }

    if(args.length > 1){

        //team2 = _Team.getTeam(args[1]);

        //if(team2 == null) return new _NoticeEmbed(Colors.ERROR, "Invalid second team - Please specify an existing team")

        team2Check = true;

    }

    let filtered = _Match.getMatchesObj();

    if(dateCheck){

        let date = new Date();
        let dateArray = args[0].split("/");

        date.setDate(parseInt(dateArray[1]));
        date.setMonth(parseInt(dateArray[0]));
        date.setFullYear(parseInt(dateArray[2]));

        filtered = filtered.filter(val => {
            let matchDate = new Date(val.date);
            return matchDate.getDate() == date.getDate() && matchDate.getMonth() == date.getMonth() && matchDate.getFullYear() == date.getFullYear();
        })

    } else if(team1Check && !team2Check){

        filtered = filtered.filter(val => val.team1 == args[0] || val.team2 == args[0]);
        
    } else if(team1Check && team2Check){

        filtered = filtered.filter(val => (val.team1 == args[0] && val.team2 == args[1]) || (val.team1 == args[1] && val.team2 == args[0]));

    }

    let description = "";

    filtered.forEach((val, i) => {
        //let date = new Date(val.date);
        let score = "TBD";
        if(val.score1 != null || val.score2 != null) score = `${val.score1}-${val.score2}`;
        description += `${val.team1} vs ${val.team2}, Score: ${score}, ID: ${i}`;
    })

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Matches")
        .setDescription(description);

    message.channel.send(embed);

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

module.exports.help = {
    name: "listmatches",
    aliases: ["list-matches", "lm", "matches"],
    permission: Groups.DEFAULT,
    description: "Lists all the matches or with a filter",
    usage: "listmatches <team1> [team2 OR listmatches <date>"
}