const _User = require('../../util/Constructors/_User');
const Discord = require('discord.js');
const Colors = require('../../util/Enums/Colors');
const Groups = require('../../util/Enums/Groups');

module.exports.run = async (bot,message,args,cmd) => {

    let map = _User.getEconomyMap();
    
    let arr = getSortedArray(map);
    
    let msg = "";
    var i = 1;
    
    arr.forEach((v) => {
        if(i > 10) return
        else {
            if(bot.users.get(v)){
                msg += `${i} - ${bot.users.get(v).username} - ${map.get(v).xp}\n`
                i++;
            }
        }
    })
    
    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setDescription(msg)
        .setTitle("Top Xp");
        
    message.channel.send(embed);
    
}

function getSortedArray(map){

    let arr = [];

    map.forEach((v, k) => {
        arr.push(k);
    })

    arr.sort((a, b) => map.get(b).xp - map.get(a).xp);

    return arr;

}

module.exports.help = {
    name: "topxp",
    aliases: ["top-xp", "leadingxp"],
    permission: Groups.DEFAULT,
    description: "Gets the top 10 players with xp",
    usage: "topxp>"
}