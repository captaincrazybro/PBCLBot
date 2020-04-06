const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team name").send(message.channel);

    let teamName = args[0];

    let team = _Team.getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team ndoes not exist").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a nickname").send(message.channel);

    let nick = args[1];

    team.setNick(nick);

    new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${teamName}'s nickname to ${nick}`).send(message.channel);

    return;

}

module.exports.help = {
    name: "setnick",
    aliases: ["set-team", "setnickname"],
    permission: Groups.MOD,
    description: "Sets the nickname for a team",
    usage: "setnickname <team> <nickname>"
}