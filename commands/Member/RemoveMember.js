const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi =  require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a player").send(message.channel);

    let playerName = args[0];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(val => {

        /*if(val == false || val == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);*/

        let player = _Player.getPlayer(playerName);

        if(player == null) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a team").send(message.channel);

        let teamName = args[1];

        let team = _Team.getTeam(teamName)

        if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid team - This team does not exist").send(message.channel);

        player.remTeam();

        new _NoticeEmbed(Colors.SUCCESS, `Successfully removed ${player.name} from ${team.name}`).send(message.channel);

    })

}

module.exports.help = {
    name: "removemember",
    aliases: ["rem-mem", "remove-member"],
    permission: Groups.MOD,
    description: "Removes a member from a team",
    usage: "removemember <name> <team>"
}
