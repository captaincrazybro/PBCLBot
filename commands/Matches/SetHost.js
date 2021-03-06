const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');
const players = require('../../storage/players.json');
const index = require('../../bot.js')
const _Match = require('../../util/Constructors/_Match.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.lenght == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a match id").send(message.channel);

    if(isNaN(args[0])) return new _NoticeEmbed(Colors.ERROR, "Invalid id - Id needs to be a number").send(message.channel);

    let id = parseInt(args[0]);

    let match = _Match.getMatchById(id);

    if(match == null) return new _NoticeEmbed(Colors.ERROR, "Invalid id - No matches are associated with that id").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify the host's discord").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[1]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[1].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[1].toLowerCase());

    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid discord user - Please specify a valid discord user (mention, id or name)");

    if(args.length == 2) return new _NoticeEmbed(Colors.INFO, "Please specify the host's minecraft name").send(message.channel);

    let minecraftName = args[1];

    let promise = _MinecraftApi.getUuid(minecraftName);

    promise.then(val => {

        if(val == false || val == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        let player = _Player.getPlayer(val.name);

        if(player == null) player = _Player.addPlayer(val.name, val.id);

        //if(player.rank.toLowerCase() != "referee") return new _NoticeEmbed(Colors.ERROR, "This player is not a host").send(message.channel);

        match.setHost(user.id);

        match.setHostMc(val.id);

        return new _NoticeEmbed(Colors.SUCCESS, `You have successfully set match #${id}'s host to <@${user.id}> with IGN ${val.name}`).send(message.channel);

    })

}

module.exports.help = {
    name: "sethost",
    aliases: ["set-host", "sh"],
    permission: Groups.MOD,
    description: "Sets the host of a match",
    usage: "setreferee <discordUser>"
}