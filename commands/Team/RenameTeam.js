const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team").send(message.channel);

    let teamName = args[0];

    let team = _Team.getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "This team does not exist").send(message.channel);
    
    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a new team name").send(message.channel);
    
    let newName = args[1];

    team.setName(newName);

    new _NoticeEmbed(Colors.SUCCESS, `Successfully renamed team ${teamName} to ${newName}`).send(message.channel);

}

module.exports.help = {
    name: "renameteam",
    aliases: ["rename-team"],
    permission: Groups.MOD,
    description: "Renames a team",
    usage: "renameteam <team> <name>"
}
