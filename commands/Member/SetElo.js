const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const ranks = require('../../storage/ranks.json');
const _Player = require('../../util/Constructors/_Player');
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');
const _Blacklist = require('../../util/Constructors/_Blacklist');
const fs = require('fs');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(val => {

        if(val == false || val == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        let player = _Player.getPlayer(val.name);

        if(player == null) player = _Player.addPlayer(val.name, val.id);

        if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a kit").send(message.channel);
        
        let kitName = "";

        switch(args[1].toLowerCase()){
            case("rifle"):{
                kitName = "Rifle";
                break;
            }
            case("shotgun"):{
                kitName = "Shotgun";
                break;
            }
            case("machinegun"):{
                kitName = "Machinegun";
                break;
            }
            default:{
                new _NoticeEmbed(Colors.ERROR, "Invalid kit - Either this kit is not supported or it doesn't exist").send(message.channel);
                break;
            }
        }

        if(kitName == "") return;

        if(args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify an elo").send(message.channel);

        if(isNaN(args[2])) return new _NoticeEmbed(Colors.ERROR, "Invalid elo - This value is not a number").send(message.channel);

        let elo = Number.parseInt(args[2]);

        player.setRating(elo, kitName);

        return new _NoticeEmbed(Colors.SUCCESS, "You have successfully set " + val.name + "'s elo to " + elo + " for kit " + kitName).send(message.channel);

    })

    return;

}

module.exports.help = {
    name: "setelo",
    aliases: ["set-elo"],
    permission: Groups.ADMIN,
    description: "Manually sets a players elo",
    usage: "setelo <player> <kit> <elo>"
}