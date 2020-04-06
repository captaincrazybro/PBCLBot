const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi =  require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
const _Blacklist = require('../../util/Constructors/_Blacklist.js');
const Discord = require('discord.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a name").send(message.channel);

    let name = args[0];
    
    _MinecraftApi.getUuid(name).then(val => {
        
        if(val == false) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);
        
        if(val == undefined) return new _NoticeEmbed(Colors.ERROR, "Name update in progress.").send(message.channel);

        let player = _Player.getPlayer(val.name);

        if(player == null) player = _Player.addPlayer(val.name);
    
        let blacklist = _Blacklist.getBlacklist(val.id);
    
        if(blacklist == null) return new _NoticeEmbed(Colors.ERROR, "This player is not blacklisted").send(message.channel);
    
		blacklist.delete()
		
		return new _NoticeEmbed(Colors.SUCCESS, "You have successfully deleted the blacklist for " + val.name).send(message.channel);
        
    });

}

module.exports.help = {
    name: "removeblacklist",
    aliases: ["deleteblacklist", "remove-blacklist", "rmbl", "removebl"],
    permission: Groups.MOD,
    description: "Removes a blacklist",
    usage: "removeblacklist <player>"
}
