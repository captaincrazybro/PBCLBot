const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team").send(message.channel);

    let teamName = args[0];

    let team = _Team.getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "This team does not exist").send(message.channel);

    team.delete();

    new _NoticeEmbed(Colors.SUCCESS, `Successfully removed team ${teamName}`).send(message.channel);

}

module.exports.help = {
    name: "removeteam",
    aliases: ["deleteteam", "rem-team"],
    permission: Groups.MOD,
    description: "Removes a team",
    usage: "removeteam <team>"
}
