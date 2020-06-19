const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi =  require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify the winner").send(message.channel);

    let winnerName = args[0];

    let promise = _MinecraftApi.getUuid(winnerName)

    promise.then(winner => {

        if(winner == false || winner == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

        if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a loser").send(message.channel);
        
        let loserName = args[1];

        let lPromise = _MinecraftApi.getUuid(loserName);

        lPromise.then(loser => {

            if(loser == false || winner == undefined) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);

            if(args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify a kit").send(message.channel);

            let kitName = "";

            switch(args[2].toLowerCase()){
                case("rifle"):{
                    kitName = "Rifle";
                    break;
                }
                case("shotgun"):{
                    kitName = "Shotgun";
                    break;
                }
                case("machinegun"):{
                    kitName = "Machinegun";
                    break;
                }
                // case("machinegun"):{
                //     kitName = "MachineGun";
                //     break;
                // }
                // case("sniper"):{
                //     kitName = "Sniper";
                //     break;
                // }
                default:{
                    return new _NoticeEmbed(Colors.ERROR, "Invalid Kit - This kit does not exist").send(message.channel);
                }
            }

            if(kitName == "") return;

            let winningPlayer = _Player.getPlayer(winner.name);
            let losingPlayer = _Player.getPlayer(loser.name);

            if(winningPlayer == null) winningPlayer = _Player.addPlayer(winner.name, winner.id);
            if(losingPlayer == null) losingPlayer = _Player.addPlayer(loser.name, loser.id);

            let winningRating = 1000;
            let losingRating = 1000;

            if(winningPlayer.rating[kitName] != null) winningRating = winningPlayer.rating[kitName];
            if(losingPlayer.rating[kitName] != null) losingRating = losingPlayer.rating[kitName];

            winningPlayer.addWin(losingRating, kitName);
            losingPlayer.addLoss(winningRating, kitName);

            new _NoticeEmbed(Colors.SUCCESS, `Successfully recorded the match between ${winningPlayer.name} and ${losingPlayer.name}`).send(message.channel);

        });

    })

}

module.exports.help = {
    name: "record1v1",
    aliases: ["record-1v1"],
    permission: Groups.MOD,
    description: "Records a 1v1",
    usage: "record1v1 <winner> <loser> <kit>"
}
