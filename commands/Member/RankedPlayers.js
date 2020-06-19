const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI')
const ranks = require('../../storage/ranks.json')
const teams = require('../../storage/teams.json')
const _Player = require('../../util/Constructors/_Player.js')
const botFile = require('../../bot.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a kit").send(message.channel);

    let kitName = "";

    switch(args[0].toLowerCase()){
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
            return new _NoticeEmbed(Colors.ERROR, "This kit either does not exist or is not supported").send(message.channel);
        }
    }

    var rankings = "";

    let playersSorted = _Player.getPlayerObj().filter(val => val.rating[kitName] != null);

    playersSorted = playersSorted.sort((a, b) => { return b.rating[kitName] - a.rating[kitName] });

    let i = 0;

    while(i < playersSorted.length && i < 10){
        let val = playersSorted[i];
        rankings += `${i + 1}. ${val.name}: ${val.rating[kitName]}\n`;
        i++;
    }

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setTitle("Rankings - Page 1")
        .setDescription(rankings);

    message.channel.send(embed).then(async (message) => {
        await message.react("⬅");
        message.react("➡");
        let obj = {
            page: 1,
            kit: kitName
        }
        botFile.rankedReactionsMap.set(message.id, {kit: kitName, page: 0});
    })

    return;

}

module.exports.help = {
    name: "rankedelo",
    aliases: ["ranked-elo", "topelo", "top-elo"],
    permission: Groups.DEFAULT,
    description: "Gets the ranked player leaderboard",
    usage: "rankedplayers <kit>"
}