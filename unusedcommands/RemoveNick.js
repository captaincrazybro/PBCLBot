const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team name").send(message.channel);

    let teamName = args[0];

    let team = _Team.getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team does not exist").send(message.channel);

    team.setNick("None");

    new _NoticeEmbed(Colors.SUCCESS, `Successfully removed ${teamName}'s nickname`).send(message.channel);

    return;

}

module.exports.help = {
    name: "removenick",
    aliases: ["rem-nick", "removenickname"],
    permission: Groups.MOD,
    description: "Removes the nickname from a team",
    usage: "removenick <team>"
}