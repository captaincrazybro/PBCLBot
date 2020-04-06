const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi =  require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team").send(message.channel);

    let teamName = args[0];

    let team = _Team.getTeam(teamName)

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid team - This team does not exist").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify an owner").send(message.channel);

    let playerName = args[1];

    let promise = _MinecraftApi.getUuid(playerName)

    promise.then(val => {

        if(val == false) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        //if(_Player.getPlayer(playerName) && _Player.getPlayer(playerName).team != team.name) return new _NoticeEmbed(Colors.ERROR, "This player is not on this team");

        team.setOwner(val.id);

        new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${team.name}'s owner to ${val.name}`).send(message.channel);


    })

}

module.exports.help = {
    name: "setmentor",
    aliases: ["set-mentor"],
    permission: Groups.MOD,
    description: "Sets the mentor of a team",
    usage: "setmentor <team> <mentor>"
}
