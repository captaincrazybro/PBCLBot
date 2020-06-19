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

    if(playerName == "-a"){

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

        let players = _Player.getPlayerObj()

        players.forEach(player => {
            if(player.rating[kitName] != null){
                player.rating[kitName] = null;
            }
        });

        fs.writeFile("./storage/players.json", JSON.stringify(players), err => {
            if(err) console.log(err);
        })

        new _NoticeEmbed(Colors.SUCCESS, "You have successfully reset all players for kit " + kitName).send(message.channel);

        return;
    } else {

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

            if(player.rating[kitName] == null) return new _NoticeEmbed(Colors.ERROR, "This player either is already reset or does not have a rating").send(message.channel);

            player.setRating(null, kitName);

            return new _NoticeEmbed(Colors.SUCCESS, "You have successfully reset " + val.name + " for kit " + kitName).send(message.channel);

        })

        return;

    }

}

module.exports.help = {
    name: "resetplayer",
    aliases: ["reset-player"],
    permission: Groups.ADMIN,
    description: "Gets the profile of a player (include -a to reset all player for that kit)",
    usage: "resetplayer <player|-a> <kit>"
}
