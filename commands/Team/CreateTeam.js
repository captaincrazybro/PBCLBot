const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team name").send(message.channel);

    let teamName = args[0];

    let team = _Team.createTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team name already exists").send(message.channel);

    new _NoticeEmbed(Colors.SUCCESS, `Successfully created team ${teamName}`).send(message.channel);

    return;

}

module.exports.help = {
    name: "createteam",
    aliases: ["add-team", "create-team"],
    permission: Groups.MOD,
    description: "Creates a team",
    usage: "createteam <name>"
}