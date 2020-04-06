/*var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.render("../views/index.html");
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});*/

const settings = require("./settings.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const bot = new Discord.Client({disableEveryone: true});
const _User = require('./util/Constructors/_User')
const _Role = require("./util/Constructors/_Role.js")
const _MinecraftAPI = require('./util/Constructors/_MinecraftAPI');
const MojangAPI = require('mojang-api')
const ms = require('ms');
const Colors = require("./util/Enums/Colors.js");
const fs = require("fs");
const _Player = require("./util/Constructors/_Player.js");
const filter = require("./storage/filter.json");
const _NoticeEmbed = require("./util/Constructors/_NoticeEmbed")
const _Blacklist = require("./util/Constructors/_Blacklist");
require("dotenv").config();

module.exports.blAddMap = new Map();
 
let disabledChannels = ["542812804374069258",
"663015781709119509",
"663060798029037568",
"542812785877319700",
"664300314928611350",
"551066764314673152",
"542808137057435677",
"542808159387910259",
"542808317873881109",
"542812805146083329",
"592093959824736268",
"678673861239242796"]
 
module.exports.reload = false;
 
module.exports.bot = bot;
 
bot.commands = new Discord.Collection();  
 fs.readdir('./commands/', (err, files) => {
 
  files.filter(f => f.split(".").length == 1).forEach((f2, i) => {
 
  fs.readdir(`./commands/${f2}/`, (err, files) => {
 
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Couldn't find commands.");
      return;
    }
 
    jsfile.forEach((f, i) =>{
        let commandsCollection = new Discord.Collection();
        let props = require(`./commands/${f2}/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
      props.help.aliases.forEach(function(val, i){
        bot.commands.set(val, props)
      })
    });
  });
   })
 
})
 
module.exports.commands = bot.commands;
 
client.on('error', console.error);
bot.on('error', e => {
  console.log(e)
})
 
bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setPresence({ game: { name: "Super Paintball" } });
});
 
setInterval(function(){
  _Player.updateNames()
 
  /*let players = require('./js/bot/storage/players.json');
 
  fs.writeFile('./backups/players.json', JSON.stringify(players), (err) => {
      if(err) console.log(err);
  });*/
}, ms("1h"));
//_Player.updateNames()
 
bot.on("message", async message => {
 
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  if(message.channel.id === "458140177378967562") return;
 
  //if(violatesFilter(message.content)) return message.delete;
   
    let prefix = settings.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
  let args = messageArray.slice(1);
 
  let user = new _User(message.author.id);
 
  levelUp(user, message);
 
  doBlAdd(message);
 
  //_MinecraftAPI.getUuid("Cqptain").then(val => _MinecraftAPI.getName(val).then(val2 => console.log(val2)))
 
  //xp.run(bot,message,args,cmd,fs);
 
  if(cmd.startsWith(settings.prefix)){
    let commandfile = bot.commands.get(cmd.replace(settings.prefix, ""));
    if(!commandfile) return;
    if(settings.owners.includes(message.author.id) || user.hasPermission(commandfile) || hasPermissionRoles(message, commandfile)){
      let sett = require('./settings.json');
      if(settings.owners.includes(message.author.id) || sett.maintenance == false){
    if(commandfile) commandfile.run(bot,message,args,cmd);
      } else {
    message.channel.send("Bot is in maintenance");
      }
    }
  }
   
});
 
bot.on('messageUpdate', (oldMessage, newMessage) => {

  if(newMessage.channel.guild != undefined) if(newMessage.channel.guild.id != '665698425601392749') return;
 
  if(disabledChannels.includes(newMessage.channel.id)) return;
 
  if(newMessage.content == "") return;
  if(oldMessage.content == "") return;

  if(newMessage.content == oldMessage.content) return;
 
  let embed = new Discord.RichEmbed()
    .setColor(Colors.INFO)
    .setTitle("Message Edited")
    .addField("Author", newMessage.author.username)
    .addField("Old Message", oldMessage.content)
    .addField("New Message", newMessage.content)
    .addField("Channel", `<#${newMessage.channel.id}>`)
    .setTimestamp(new Date());
 
  bot.guilds.get('692395141427757067').channels.get('692801275280228382').send(embed);
});
 
bot.on("messageDelete", (message) => {

  if(message.channel.guild != undefined) if(message.channel.guild.id != '665698425601392749') return;
   
    if(message.content == "") return;
 
    if(disabledChannels.includes(message.channel.id)) return;
 
   let embed = new Discord.RichEmbed()
    .setColor(Colors.ERROR)
    .setTitle("Message Deleted")
    .addField("Author", message.author.username)
    .addField("Content", message.content)
    .addField("Channel", `<#${message.channel.id}>`)
    .setTimestamp(new Date());
 
  bot.guilds.get('692395141427757067').channels.get('692801275280228382').send(embed);
});
 
function hasPermissionRoles(message, prop){
  let member = message.guild.members.get(message.author.id);
  let outcome = false;
  member.roles.forEach((val, i, map) => {
    let role = new _Role(val.id);
    if(role.hasPermission(prop)){
      outcome = true;
      return;
    }
  })
  return outcome;
}
 
function violatesFilter(message){
 
  var outcome = false;
 
  filter.forEach(val => {
    if(message.includes(val)) outcome = true;
  })
 
  return outcome;
 
}
 
function levelUp(user, message){
 
  let originalXp = user.xp;
 
  let originalLevel = user.getLevel();
 
  user.xp += 50;
 
  //if(bot.guilds.get("665698425601392749").roles.get("678674225720066100")) user.xp += 50;
 
  let newLevel = user.getLevel();
 
  user.updateEconomy();

  if(newLevel % 10 === 0){
    let levelRole = message.guild.roles.find('name', `Level ${newLevel}`);

    if(!levelRole) {
        levelRole = message.guild.createRole({
            name: `Level ${newLevel}`,
            color: "#000000",
            permissions:[]
        }).then(() => {
          message.guild.members.get(message.author.id).addRole(levelRole);
        });
    } else {
      message.guild.members.get(message.author.id).addRole(levelRole);
    }
  }
 
  if(originalLevel != newLevel){
    let embed = new Discord.RichEmbed()
      .setColor(Colors.SUCCESS)
      .setDescription(`<@${user.id}>, you have leveled up to level ${newLevel}`)
 
    message.channel.send(embed);
  }
 
}
 
function doBlAdd(message){
 
  if(module.exports.blAddMap.has(message.author.id)){
 
    if(message.content.toLowerCase() == "exit"){
      module.exports.blAddMap.delete(message.author.id);
      return new _NoticeEmbed(Colors.SUCCESS, "You have successfully exited this blacklist creation wisard").send(message.channel);
    }
 
    let obj = module.exports.blAddMap.get(message.author.id);
 
    switch(obj.step){
      case(0):{
       
        _MinecraftAPI.getUuid(message.content).then(val => {
 
          if(message.content == null) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);
 
          if(val == false || !_Player.getPlayer(message.content)) return new _NoticeEmbed(Colors.ERROR, "Invalid Player - This player does not exist").send(message.channel);
 
          let player = _Player.getPlayer(message.content);
 
          //if(player.rank.toLowerCase() != "referee")
 
          let newObj = module.exports.blAddMap.get(message.author.id)
 
          newObj.referee = player.name;
          newObj.step = 1;
 
          module.exports.blAddMap.set(message.author.id, newObj);
 
          return new _NoticeEmbed(Colors.SUCCESS, "The referee for this blacklist has been set to " + player.name + ". Please enter the start date of the blacklist (0000-00-00).").send(message.channel);
 
        })
      }
      break;
      case(1):{
 
        if(!checkDate(message.content)) return new _NoticeEmbed(Colors.ERROR, "Invalid Date - Please specify a valid date (0000-00-00)").send(message.channel);
 
        let newObj = module.exports.blAddMap.get(message.author.id)
 
        newObj.start_date = message.content;
        newObj.step = 2;
 
        module.exports.blAddMap.set(message.author.id, newObj);
 
        return new _NoticeEmbed(Colors.SUCCESS, "The start date for this blacklist has been set to " + message.content + ". Please enter the type of blacklist (temporary or permanent).").send(message.channel);
         
      }
      case(2):{
 
        if(message.content.toLowerCase() != "temporary" && message.content.toLowerCase() != "permanent") return new _NoticeEmbed(Colors.ERROR, "Invalid Type - Please specify a valid type (temporary or permanent)").send(message.channel);
 
        let newObj = module.exports.blAddMap.get(message.author.id)
 
        newObj.type = message.content.toLowerCase();
 
        if(message.content.toLowerCase() == "temporary"){
          newObj.step = 3;
          new _NoticeEmbed(Colors.SUCCESS, "The start type for this blacklist has been set to " + message.content + ". Please enter the end date of the blacklist (0000-00-00).").send(message.channel);
        } else {
          newObj.end_date = "NONE";
          newObj.step = 4;
          new _NoticeEmbed(Colors.SUCCESS, "The start type for this blacklist has been set to " + message.content + ". Please enter the alts of the blacklist.").send(message.channel);
        }
 
        module.exports.blAddMap.set(message.author.id, newObj);
 
        return
 
      }
      case(3):{
 
        if(!checkDate(message.content)) return new _NoticeEmbed(Colors.ERROR, "Invalid Date - Please specify a valid date (0000-00-00)").send(message.channel);
 
        let newObj = module.exports.blAddMap.get(message.author.id)
 
        newObj.end_date = message.content;
        newObj.step = 4;
 
        module.exports.blAddMap.set(message.author.id, newObj);
 
        return new _NoticeEmbed(Colors.SUCCESS, "The end date for this blacklist has been set to " + message.content + ". Please enter the alts of blacklist.").send(message.channel);
         
      }
      case(4):{
 
        let newObj = module.exports.blAddMap.get(message.author.id)
 
        newObj.alts = message.content;
        newObj.step = 5;
 
        module.exports.blAddMap.set(message.author.id, newObj);
 
        return new _NoticeEmbed(Colors.SUCCESS, "The alts for this blacklist has been set to " + message.content + ". Please enter any referee notes for this blacklist.").send(message.channel);
         
      }
      case(5):{
 
        let newObj = module.exports.blAddMap.get(message.author.id)
 
        newObj.notes = message.content;
        newObj.step = 5;
 
        module.exports.blAddMap.set(message.author.id, newObj);
        module.exports.blAddMap.delete(message.author.id);
 
        delete newObj.step;
 
        _Blacklist.createBlacklist(newObj);
 
        return new _NoticeEmbed(Colors.SUCCESS, "The referee notes for this blacklist have been set to " + message.content + ". The blacklist " + newObj.uuid + " has successfully been created.").send(message.channel);
         
      }
 
    }
 
  }
 
}
 
function checkDate(date){
 
  if(date.split("-").length != 3) return false;
 
  let outcome = true;
 
  date.split("-").forEach(val => {
    if(isNaN(val)) outcome = false;
  })
 
  return outcome;
 
}

/*bot.on('messageReactionAdd', (reaction, user) => {

  console.log("true");

  switch(reaction.message.id){
    case("696452274309824582"):{
      switch(reaction.emoji.name){
        case("rifle"):{
          addRoleAndCreateIfNotExists(user, "Rifle");
          break;
        }
        case("shotgun"):{
          addRoleAndCreateIfNotExists(user, "Shotgun");
          break;
        }
        case("machine_gun"):{
          addRoleAndCreateIfNotExists(user, "Machine Gun");
          break;
        }
        case("sniper"):{
          addRoleAndCreateIfNotExists(user, "Sniper");
          break;
        }
        default:{
          reaction.remove;
        }
      }
      break;
    }
    case("696453293227900978"):{
      switch(reaction.emoji.name){
        case("newspaper"):{
          addRoleAndCreateIfNotExists(user, "General Updates");
          break;
        }
        case("man_office_worker"):{
          addRoleAndCreateIfNotExists(user, "Staff Updates");
          break;
        }
        case("video_game"):{
          addRoleAndCreateIfNotExists(user, "New Matches");
          break;
        }
        case("game_die"):{
          addRoleAndCreateIfNotExists(user, "Match Results");
          break;
        }
      }
    }
  }

});*/


function addRoleAndCreateIfNotExists(user, roleName){

  let kitRole = message.guild.roles.find('name', roleName);

  if(!kitRole) {
    kitRole = message.guild.createRole({
          name: roleName,
          color: "#000000",
          permissions:[]
      }).then(() => {
        message.guild.members.get(user.id).addRole(kitRole);
      });
  } else {
    message.guild.members.get(user.id).addRole(kitRole);
  }

}
 
bot.login(process.env.TOKEN);
