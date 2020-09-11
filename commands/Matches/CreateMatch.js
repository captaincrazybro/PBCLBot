const Discord = require('discord.js');
const _Team = require('../../util/Constructors/_Team.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js');
const Colors = require('../../util/Enums/Colors.js');
const Groups = require('../../util/Enums/Groups.js');
const _Match = require('../../util/Constructors/_Match.js');

module.exports.run = (bot,message,args,cmd) => {

    if(args.lenght == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a first team").send(message.channel);

    let team1 = _Team.getTeam(args[0]);

    if(team1 == null) return new _NoticeEmbed(Colors.ERROR, "Invalid first team - Please specify an existing team").send(message.channel);
    
    if(args.length == 1) return new _NoticeEmebed(Colors.WARN, "Please specify a second team").send(message.channel);

    let team2 = _Team.getTeam(args[1]);

    if(team2 == null) return new _NoticeEmbed(Colors.ERROR, "Invalid second team - Please specify an existing team").send(message.channel);

    let match = _Match.createMatch(team1.name, team2.name, null, null, null);

    return new _NoticeEmbed(Colors.SUCCESS, `You have successfully created a match between ${team1.name} and ${team2.name}`).send(message.channel);

}

module.exports.help = {
    name: "creatematch",
    aliases: ["create-match", "cm", "addmatch"],
    permission: Groups.MOD,
    description: "Creates a match between two teams",
    usage: "creatematch <team1> <team2>"
}