const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const _Team = require('../../util/Constructors/_Team');
const MySQL = require('../../MySQL');
const userTeams = require('../../storage/userteams.json');

module.exports.run = async(bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a role or user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(user != null) if(user.username == undefined) user = user.user;

    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid role or user (mention or id)").send(message.channel);
    
    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a team ").send(message.channel);

    let teamName = args[1];

    let team = _Team.getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid team - Please specify a valid team").send(message.channel);

    let teamRole = message.guild.roles.find('name', `${team.name}`);

    if(!teamRole) {
        teamRole = message.guild.createRole({
            name: `${team.name}`,
            color: `${team.color}`,
            permissions:[]
        }).then(() => {
          message.guild.members.get(message.author.id).addRole(teamRole);
        });
    } else {
      message.guild.members.get(message.author.id).addRole(teamRole);
    }

    let conn = MySQL.getConnection();

    if(getUser(user.id) == null){
        let obj = {
            userId: user.id,
            team: team.name,
            role: "Member"
        }
        userTeams.push(obj);
    } else {
        let obj = getUser(user.id);
        obj.team = team.name;
        userTeams[getUserIndex(user.id)] = obj;
    }    

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`Successfully set <@${user.id}>'s team to ${team.name}`)

    message.channel.send(embed);

}

function getUser(id){
    let index = userTeams.findIndex(val => val.id == id);
    if(!index) return null;
    else return userTeams[index];
}

function getUserIndex(id){
    let index = userTeams.findIndex(val => val.id == id);
    if(!index) return null;
    else return index;
}

module.exports.help = {
    name: "setuserteam",
    aliases: ["set-user-team", "discord-user-team"],
    permission: Groups.MOD,
    description: "Sets a discord user's team",
    usage: "setuserteam <user> <team>"
}