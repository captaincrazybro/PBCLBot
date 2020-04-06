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

    conn.query("SELECT * FROM pbcl WHERE userId = ?", [user.id], (err, result) => {
        if(err) return console.log(err);
        if(require.length > 0){
            if(message.guild.members.get(user.id).roles.find('id', teamRole.id)){
                message.guild.members.get(user.id).removeRole(teamRole);
            }
            conn.query("UPDATE pbcl SET team = ? WHERE userId = ?", [team.name, user.id], err => {
                if(err) console.log(err);
            })
        } else {
            conn.query("INSERT INTO pbcl (userId, team, role) VALUES (?, ?, ?)", [user.id, team.name, "Member"], err => {
                if(err) console.log(err);
            });
        }
    });

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`Successfully set <@${user.id}>'s team to ${team.name}`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "setuserteam",
    aliases: ["set-user-team", "discord-user-team"],
    permission: Groups.MOD,
    description: "Sets a discord user's team",
    usage: "setuserteam <user> <team>"
}