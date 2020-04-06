const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const ranks = require('../../storage/ranks.json');
const _Player = require('../../util/Constructors/_Player');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(val => {

        if(val == false || !_Player.getPlayer(playerName)) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        let player = _Player.getPlayer(val.name);

        if(player == null) player = _Player.addPlayer(val.name);

        player.remRank();

        new _NoticeEmbed(Colors.SUCCESS, `Successfully removed ${val.name}'s rank`).send(message.channel);

    })

    return;

}

module.exports.help = {
    name: "removerank",
    aliases: ["remove-rank", "rem-rank"],
    permission: Groups.MOD,
    description: "Removes the rank of a player",
    usage: "removerank <player>"
}
