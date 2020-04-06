const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team name").send(message.channel);

    let teamName = args[0];

    let team = _Team.getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team does not exist").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a color").send(message.channel);

    let color = args[1].toUpperCase();

    team.setColor(color);

    new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${teamName}'s color to ${color}`).send(message.channel);

    return;

}

module.exports.help = {
    name: "setcolor",
    aliases: ["set-color"],
    permission: Groups.MOD,
    description: "Sets the color for a team",
    usage: "setcolor <team> <color>"
}