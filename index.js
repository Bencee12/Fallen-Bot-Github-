const Discord = require("discord.js");
const superagent = require("superagent");
const { getMember } = require("./functions")
const ms = require("ms")
const { get, subscribe } = require("superagent");
const say = require(".//say")
const coins = require("./coins.json");
const ytdl = require("ytdl-core")
const xp = require("./xp.json");
const kills = require("./killed.json")
const bot = new Discord.Client();
var which = 0;
var timer = setInterval(NV, 80000);
var commands = true;

bot.on("ready", async ()=> {
    console.log("Bot Online lett! Parancsok betöltése sikeres volt!")
      bot.user.setActivity(`${bot.user.username} ${bot.guilds.size} Szerveren van! `, { type: "LISTENING"});
bot.user.setStatus('online')
});

bot.on('message',(message) => {
  var prefix = ".";
  if(message.content.startsWith(prefix + "változtatás"))
  {
    NV();
  }
});

function NV(){
  if(commands)
  {
    bot.user.setActivity(`${bot.user.username} .parancsok, a parancsok megnézéséhez`, {type: 3});
    commands = !commands
    return;
  }
  else
  {
    bot.user.setActivity(`${bot.user.username} .help [HAMAROSAN!!!!!]`, {type: 2});
    return;
  }
};

bot.on("message", msg => {
  if(msg.content === "Jó Reggelt"){
    msg.reply('Jó Reggelt! 👋')
  }
})

bot.on("message", msg => {
  if(msg.content === "Hello"){
    msg.reply('Szia 👋')
  }
})

bot.on("message", msg => {
  if(msg.content === "Sziasztok"){
    msg.reply('Szia 👋')
  }
})

bot.on("message", msg => {
  if(msg.content === "Cső"){
    msg.reply('Szia 👋')
  }
})

bot.on("message", msg => {
  if(msg.content === "Csá"){
    msg.reply('Szia 👋')
  }
})

bot.on("message", msg => {
  if(msg.content === "Szevasztok"){
    msg.reply('Szia 👋')
  }
})


bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm");

  var prefix = ".";
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

if(cmd === `${prefix}pingproba`) {
  message.channel.send("Pong! :ping_pong:")
}
if(cmd === `${prefix}botstatus`){
  const setStatus = message.content.split(' ');

    if(!message.member.hasPermission("ADMINISTRATOR")){
        return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
    }

    else if(setStatus[1] === 'idle'){
        bot.user.setStatus('idle')
            .then(message.channel.send(`Sikeresen beállítottad a bot statusát! Új státusza:` +setStatus[1]))
            .catch(console.error);
    } 

    else if(setStatus[1] === 'online'){
        bot.user.setStatus('online')
            .then(message.channel.send(`Sikeresen beállítottad a bot statusát! Új státusza:` + setStatus[1]))
            .catch(console.error);
    }

    else if(setStatus[1] === 'invisible'){
        bot.user.setStatus('invisible')
            .then(message.channel.send(`Sikeresen beállítottad a bot statusát! Új státusza:` + setStatus[1]))
            .catch(console.error);
    }

    else if(setStatus[1] === 'dnd'){
        bot.user.setStatus('invisible')
            .then(message.channel.send(`Sikeresen beállítottad a bot statusát! Új státusza:` + setStatus[1]))
            .catch(console.error);
    }

    else{
        return message.channel.send(`❌Hiba! Kérlek add meg a bot statusát. **(Használat: .botstatus online)**, Állapotok: Online(elérhető), idle(tétlen), invisible(láthatatlan), dnd(Elfoglalt) ❌`);
    }

}
if(cmd === `${prefix}tempmute`) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("❌ Hiba! Emlísd meg egy jatékost!");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("❌ Hiba! Nem tudom mutolni, mert nagyobb rangja van! ❌");
  let reason = args.slice(2).join(" ");
  if(!reason) return message.reply("❌ Hiba! Add meg az indokot!");

  let muterole = message.guild.roles.find(`name`, "muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("❌ Hiba nem adtad meg az időegységet!");

  message.delete().catch(O_o=>{});

  try{
    await tomute.send(`Hi! You've been muted for ${mutetime}. Sorry!`)
  }catch(e){
    message.channel.send(`A user has been muted... but their DMs are locked. They will be muted for ${mutetime}`)
  }

  let muteembed = new Discord.RichEmbed()
  .setDescription(`Mute executed by ${message.author}`)
  .setColor("#0000000")
  .addField("Muted Játékos", tomute)
  .addField("Mutolta:", message.channel)
  .addField("Idő:", message.createdAt)
  .addField("Length", mutetime)
  .addField("Indok:", reason);

  let channel = message.guild.channels.find(c => c.name === "chat");
  if(!channel) return message.reply("❌ Hiba! Nem találtam a chat csatornát! ❌");
  message.guild.channels.send(muteembed);

  await(tomute.addRole(muterole.id));

  setTimeout(function(){
    tomute.removeRole(muterole.id);
  }, ms(mutetime));


//end of module
}
if(cmd === `${prefix}kill`) {
  const target = message.mentions.users.first();

  if (!target)
    return message.channel.send(`${message.author} killed themselves. 💀`);

  const id = target.id;
  let deathCount = kills[id];

  if (!deathCount) {
    kills[id] = 1;

    const emb = new Discord.RichEmbed()
      .setColor('#0099ff')
      .addField(`${message.author} killed ${target.tag} 🔪`, `${target.tag} has been killed for the first time!`, true)
      .setImage('https://i.imgur.com/7MkzxTT.gif')

    message.channel.send(emb);

  } else {
    deathCount = (kills[id] = kills[id] + 1);

    const emb = new Discord.RichEmbed()
      .setColor('#0099ff')
      .addField(`${message.author} megölte: ${target.tag} 🔪`, `${target.tag} meg lett ölve: ${deathCount} idő!`, true)
      .setImage('https://i.imgur.com/7MkzxTT.gif')

    message.channel.send(emb);
  }
}          
if(cmd === `${prefix}jelentés`) {
  if (message.channel.type === "dm");
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
  if(!rUser) return message.channel.send("❌ Hiba! Nem tegelted meg a felhasználót! ❌")
  let reason = args.join(" ").slice(22);

  if (!reason) return message.reply('❌ Hiba! Nem adtad meg a jelentés nevét! (pl. .jelentés #jelentés Jancsi káromkodott! ❌'); 
  let reportEmbed = new Discord.RichEmbed()
  .setDescription("Játékos Jelentés")
  .setColor("YELLOW")
  .addField(" *>* Jelentett játékos", `${rUser} ID: ${rUser.id}`)
  .addField(" *>* Jelentést kiszabta", `${message.author} ID: ${message.author.id}`)
  .addField(" *>* Ebben a csatornában lett jelentve", message.channel)
  .addField(" *>* Jelentést időpontja ", message.createdAt)
  .addField(" *>* Ezen a szerveren lett jelentve", `${message.guild.name}`)
  .addField(" *>* Indok: ", reason)
  .setFooter("Synox bot • játékos jelentés", bot.user.displayAvatarURL)
  .setTimestamp();

  let reportchannel = message.guild.channels.find(`name`, "jelentés")
  if(!reportchannel) return message.channel.send("❌ Hiba! Nemtaláltam a jelentés csatornát! ❌")	  
  message.delete().catch(O_o=>{});
  reportchannel.send(reportEmbed);
  return
}       
if(cmd === `${prefix}kép`){
  const toSmore = [
    'https://www.poptarts.com/content/NorthAmerica/pop_tarts/en_US/pages/flavors/bakery/frosted-s-mores-toaster-pastries/jcr:content/productContent/par/responsiveimage.img.png/1475703429032.png',
    'https://i.ytimg.com/vi/aH8Xhz8a6VA/maxresdefault.jpg',
    'https://i5.walmartimages.com/asr/a666e566-cb3c-49e3-b53e-ec969e4c85c4_1.3194f476fa1cb6a1751cb559c2a67b58.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Pop-Tarts-Smores.jpg',
    'https://static1.squarespace.com/static/553b26fde4b08ceb08a4242c/553b2823e4b0eb3719c6d635/553b2840e4b0eb3719c7e599/1312325953023/1000w/6002537933_e8d711701d.jpg',
    'https://s-media-cache-ak0.pinimg.com/736x/6a/24/32/6a2432d9f8b0d57243daa7fe0c67745f.jpg',
    'https://static1.squarespace.com/static/553b26fde4b08ceb08a4242c/553b2823e4b0eb3719c6d635/553b2840e4b0eb3719c7e597/1312325932973/1000w/6003055289_9c6c378d29.jpg',
    'http://www.everyview.com/wp-content/uploads/2009/09/smorespoptar.jpg',
    'http://www.thegrocerygirls.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/N/Y/NYFMK.jpg.jpg',
    'http://www.theimpulsivebuy.com/images/smorespoptarts.jpg',
    'https://s-media-cache-ak0.pinimg.com/736x/12/4a/da/124ada781e33ae30fed95b616c19c0f1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUazFmo_xjAOxt44oDs4uypI7cu0ZFJprbOXo-5kLuvZa6V2wW',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4PndtuGusz7YTaHQ6L7iB3Oxt0L4Qsu6_88GLkPjSWpwU_kfU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZvH2ZQhcIFPyNIZlU1pVhfxk82g0T-ttaIIY9F3x0k5KgO3vn',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxf-9Siyd9MYyvPLCeyZPHJE4yODJJSFy9nje5K5EhAxtsrUy6fg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG7_P7wGeFYGeeQUp0F_p_jxTjX58nfyQXTRmec7m3sB0MGcRf',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm2botsr9ClVPFi3UGOEJIhzWEr7zRFu0et9qw1ptoDg8_w77AMQ',
    'http://www.taquitos.net/im/sn/PopTarts-Smores.jpg',
    'https://i5.walmartimages.ca/images/Large/140/637/140637.jpg',
    'https://thejelliedbelly.files.wordpress.com/2013/12/pop-t.jpg',
    'https://runningtofit.files.wordpress.com/2010/07/img_3456.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMukpkvYLL_AVtL1JV11mOXcuoecML2K1t1ohfhtRLH-8hNSmhQ',
    'http://theswca.com/images-food/poptarts-smores.jpg'
  ];
  message.channel.send(toSmore[Math.floor(Math.random() * toSmore.length)]);
}
if(cmd === `${prefix}meme`){
  let toMeme = ['https://i.redd.it/0ilh488xbudz.png',
      'https://cdn.discordapp.com/attachments/310611569794875404/353539349742092289/image.jpg',
      'http://weknowmemes.com/wp-content/uploads/2012/02/the-internet-is-a-series-of-tubes-and-theyre-full-of-cats.jpg',
      'http://assets8.popbuzz.com/2017/09/shooting-stars-meme-1488215847-list-handheld-0.png',
      'http://imgur.com/vG98twU',
      'https://thechive.files.wordpress.com/2016/07/the-dankest-memes-of-all-time-38-photos-36.jpg?quality=85&strip=info&w=600',
      'https://media0.giphy.com/media/ehc19YLR4Ptbq/giphy.gif',
      'https://qph.ec.quoracdn.net/main-qimg-cf520202236c0a99986988706131aafb-c',
      'https://qph.ec.quoracdn.net/main-qimg-762390f6c44fdcb31cf01657d776d181-c',
      'https://s-media-cache-ak0.pinimg.com/originals/2b/87/17/2b8717e385f04061c8b6b78cd4c663c7.jpg',
      'https://lh3.googleusercontent.com/-VHV916run58/WC9To_x72tI/AAAAAAAACkE/f59cQ9_9-XY/safe_image_thumb.gif?imgmax=800',
      'https://digitalsynopsis.com/wp-content/uploads/2015/03/web-designer-developer-jokes-humour-funny-41.jpg',
      'https://pbs.twimg.com/media/ClH8MiWUgAAkIqr.jpg',
      'https://s-media-cache-ak0.pinimg.com/originals/35/01/ae/3501ae95813921b4a17e7d9469f1ba05.jpg',
      'https://img.memecdn.com/me-programmer_o_331911.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/d4/f2/00/d4f20041254a0727ddce7cb81be9e68c.jpg',
      'https://wyncode.co/wp-content/uploads/2014/08/81.jpg',
      'http://4.bp.blogspot.com/-u16rpXWn7Nw/U1jWM7-8NVI/AAAAAAAAHkY/gshqLZwE8iE/s1600/Difference+Between+Gamers+&+Programmers+Keyboard.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvk7n1gMlDTW4V4BJ9dVbJuMNs0Js7nVXt2WqHzCU5hXbGNe2u',
      'http://2.bp.blogspot.com/-94oft_Og47c/U1ja4YagplI/AAAAAAAAHlU/Q0dCHUkj0_s/s1600/How+Programmers+Talk.jpg',
      'https://wyncode.co/wp-content/uploads/2014/08/191.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/cc/42/ae/cc42ae3bf4a60760c48f25b654c0cc83.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/e8/48/18/e84818a407481f290a786a9cadb2ee03.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/00/88/15/008815b7888e82d5a82dbd8eac2f0205.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/33/06/85/330685a41fa6198be3aee58339a37c62.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/03/a1/75/03a17558ed2efaea1ca19bbddea51dff.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/4f/54/29/4f5429df5ea6361fa8d3f08dfcdccdf9.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/6e/f0/bc/6ef0bc2a3298187807efa501cb05a375.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/ce/46/a6/ce46a66f29e4cc4a8179e44d70d2e560.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/20/1e/b1/201eb13e53e5d038e54b16f4f5786d0f.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/45/2b/9c/452b9c8cacfb365f9afa5baaa0bb59b4.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/ee/9a/08/ee9a08c938b4856c1b4d08486c89ad13.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/7e/90/6b/7e906b6eeac775ad40290f6d7a65f59c.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/eb/b5/d8/ebb5d8cb556236a732549ad83937546b.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/a2/9a/bc/a29abc6432badfba5106344c11c88029.jpg',
      'https://s-media-cache-ak0.pinimg.com/236x/87/dd/9e/87dd9ed4e8edeff76f8e5a1218656e16.jpg',
      'https://s-media-cache-ak0.pinimg.com/236x/eb/b5/d8/ebb5d8cb556236a732549ad83937546b.jpg',
      'https://s-media-cache-ak0.pinimg.com/236x/9f/7c/42/9f7c42a12a59e2706b144d62d9b67f4e.jpg',
      'https://cdn.discordapp.com/attachments/304065566396645377/323264999684309002/b5ac1149b38bfeec57a6e81331b699a675a2223faa69943c15a35c9409ba463f.png',
      'Your code can\'t error if you don\'t run it',
      'You can\'t go through the stages of coding if you don\'t code',
      'https://cdn.discordapp.com/attachments/283339767884677121/307266230203711489/image.jpg',
      'http://quotesnhumor.com/wp-content/uploads/2016/12/30-In-Real-Life-Memes-3-Real-Life-Funny-Memes.jpg',
      'http://cbsnews1.cbsistatic.com/hub/i/r/2016/12/20/d4acaba0-86d5-43ed-8f75-78b7ba6b8608/resize/620x465/e1d65d1488d27435ddc9e0670299dc44/screen-shot-2016-12-20-at-2-01-34-pm.png',
      'https://s-media-cache-ak0.pinimg.com/736x/3b/f8/39/3bf839473fdec43adaaba5b475832e3a.jpg',
      'http://www.fullredneck.com/wp-content/uploads/2016/04/Funny-Russia-Meme-20.jpg',
      'https://img.washingtonpost.com/news/the-intersect/wp-content/uploads/sites/32/2015/04/obama-meme.jpg',
      'http://www.fullredneck.com/wp-content/uploads/2016/11/Funny-Global-Warming-Meme-13.jpg',
      'https://i0.wp.com/blogs.techsmith.com/wp-content/uploads/2016/09/what-is-a-meme.jpg?resize=640%2C480',
      'https://s-media-cache-ak0.pinimg.com/736x/92/bd/51/92bd51939ce6e27f773aee3516b2cd6f.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8nr0iyakAda0ySUV_JceEiG9LNwNthZ71hrbvq1vhHd0j7UNdxw',
      'https://s-media-cache-ak0.pinimg.com/736x/6f/28/66/6f2866766ac899a6f91bb4775fc69b2d.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/e2/86/f9/e286f9d7ecf6f571b4a58215a2170a80.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/7f/bd/94/7fbd94ac3dca74643cc73aede5da366d.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/3d/54/8b/3d548b4bd6c1651bd13ac48edb07eba7.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/01/0b/68/010b68214bf1eeb91060732aa58bed1e.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/34/8a/92/348a92212ef1bcd89c94555e3d8380b5.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/88/40/22/8840225f3b254ee4ecaafa17b3cf324b.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/ff/56/59/ff56598016c0529acf61c70f80530456.jpg',
      'http://i0.kym-cdn.com/photos/images/original/001/256/969/543.jpg',
      'https://carlchenet.com/wp-content/uploads/2016/01/githubdown.png'];
    toMeme = toMeme[Math.floor(Math.random() * toMeme.length)];
    message.channel.send(toMeme);
  }

if(cmd === `${prefix}Szia`) {
  message.channel.send("Szia! " + message.author)
}
if(cmd === `${prefix}szolgalat`) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  var embed = new Discord.RichEmbed()
  .setColor("PINK")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .setDescription(`${message.author.username} Admin Szolgálatba lépett! Ha Segítségre van szükséged, akkor a #segítség-kérés-be írj! Ha egy játékos szabályt szegett, akkor .jelentés!`)
  .setFooter("Synox bot • Admin Szolgálat", bot.user.displayAvatarURL)
  .setTimestamp()

  message.channel.send(embed)

  message.delete();
}
if(cmd === `${prefix}szolgalat-ki`) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  var embed = new Discord.RichEmbed()
  .setColor("PINK")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .setDescription(`${message.author.username}  Kilépett az Admin szolgálatból!`)
  .setFooter("Synox bot • Admin Szolgálat", bot.user.displayAvatarURL)
  .setTimestamp()

  message.channel.send(embed)

  message.delete();
}
if(cmd === `${prefix}szabályzat`) {
  var embed = new Discord.RichEmbed()
  .setColor("WHITE")
  .setTitle("Synox Discord Szerver Szabályzata")
  .addField("-Tilos a trágár beszéd!(minimálisan lehet)", "10perc mute")
  .addField("-Tilos a floodolás!", "1 óra mute/ban")
  .addField("-Tilos a másikat szídni!", "1 óra mute")
  .addField("-Tilos olyan videót,képet megosztani ami nem a discordra tartozik!", "15perc mute")
  .addField("-Tilos olyan nevet,képet használni,ami másra sértő hatással lehet!", "Örök Ban")
  .addField("-Tilos a rasszizmus!", "1 hét ban")
  .addField("-A szobákat arra használjuk amire kell! Mindennek megvan a saját szobája!", "kick")
  .addField("**A szabályzat nem tudása nem mentesít a bűntetés alól!**", "**MINDENKIRE VONATKOZIK,NINCS KIVÉTELEZÉS!!**")
  .setFooter("Synox bot • Synox Discord Szerver Szabályzata", bot.user.displayAvatarURL)
  .setTimestamp()

  message.channel.send(embed)

  message.delete();
}
if(cmd === `${prefix}botötlet`) {
  var embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setTitle("Synox Discord Szerver Bot ötlet")
  .addField("Synox Discord Bot ötletet írhattok", "Videó link kell, ha nincs videó link, akkor nem lesz elfogadva az ötleted!")
  .addField("Discord Neved", "pl: Kiss Lajos#8888")
  .addField("Mi az ötleted?", "((Videó link kell, 2-3 mondat!))")
  .addField("Mért akarod, hogy megvalosuljon?", "2-3 mondat")
  .setFooter("Synox bot • bot ötlet", bot.user.displayAvatarURL)
  .setTimestamp()
  message.author.send("Sikeresen kiírtad a botötletett!")

  message.channel.send(embed)

  message.delete();
}
if(cmd === `${prefix}ütemezés`) {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  var embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .addField("FIGYELEM-FIGYELEM Synox Discord Bot ütemezett leállítása lesz 5 perc múlva! indoklás: Karbantartás, Mindenkit megkérünk, hogy ütemezés alatt ne használja a botot! Köszönjük!", "Bot Elindítása: 12:00-kor!", true)
  .setFooter("Synox bot • bot ütemezés")
  .setTimestamp()
  message.author.send("``Sikeresen kiírtad az ütemezést, ütemezés elkezdődik.``")

  message.channel.send(embed)

  message.delete();
}
if(cmd === `${prefix}botinfo`) {
  let version = "1.3"
  let operáció = "Windows 10 Pro"
  let embed = new Discord.RichEmbed()
  .setColor("ORANGE")
  .setTitle("Bot információ")
  .setThumbnail(bot.user.displayAvatarURL)
  .setDescription("A bot JavaScriptben készült.", true)
  .addField("Bot fejleszőtje", "Bencee.#6371", true)
  .addField("Bot neve", bot.user.username, true)
  .addField("Bot Státusza", "Elérhető", true)
  .addField("Játékban", "HAMAROSAN!!", true)
  .addField("Bot Verziója", `${version}`, true)
  .addField("Bot Készült" , bot.user.createdAt.toString().substring(0,16), true)
  .addField("A bot ennyi szerveren van bent", bot.guilds.size, true)
  .addField("A bot ezen az operációs rendszeren fut", `${operáció}`, true)
  .addField("A bot prefixe", prefix, true)
  .setFooter("Synox bot • bot Információ", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if(cmd === `${prefix}ping`) {
  let embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setDescription("Synox Bot Ping Rendszer")
  .addField("A  Bot pingje:" , `**${bot.ping}ms**`)
  .setFooter("Synox bot • Ping rendszer", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if(cmd === `${prefix}szerverinfo`) {
  let region;
        switch (message.guild.region) {
            case "europe":
                region = '🇪🇺 Europe';
                break;
            case "us-east":
                region = '🇺🇸 us-east'
                break;
            case "us-west":
                region = '🇺🇸 us-west';
                break;
            case "us-south":
                region = '🇺🇸 us-south'
                break;
            case "us-central":
                region = '🇺🇸 us-central'
                break;
            case "Hong Kong":
               region = "Hong Kong";
               break;    
        }     
  let embed = new Discord.RichEmbed()
  .setColor("YELLOW")
  .setTitle("Szerver Információi")
  .setThumbnail(message.guild.iconURL)
  .setDescription(`${message.guild.name} Szerveren a következő információkat találtam:`)
  .addField("**❯ Szerver Neve:**", `${message.guild.name}`, true)
  .addField("**❯ Szerver Készítő:**", `${message.guild.owner}`, true)
  .addField("**❯ Szerver Id:**", `${message.guild.id}`, true)
  .addField("**❯ szerver készítési ideje:**", `${message.guild.createdAt.toDateString()}`, true)
  .addField("**❯ Játékos csatlakozási ideje:**", `${message.guild.joinedAt.toDateString()}`, true)
  .addField("**❯ Szerver régió:**", region, true)
  .addField("**❯ Csatornák száma::**", `${message.guild.channels.size}`, true)
  .addField("**❯ Játékosok száma:**", `${message.guild.memberCount}`, true)
  .addField("**❯ Rangok száma:**", `${message.guild.roles.size}`, true)
  .addField('AFK Időkorlát', `${message.guild.afkTimeout / 60} perc`, true)
  .addField('AFK Channel', `${message.guild.afkChannelID === null ? 'Nincs Afk szoba beállítva!' : bot.channels.get(message.guild.afkChannelID).name} (${message.guild.afkChannelID === null ? '' : message.guild.afkChannelID})`, true)
  .addBlankField(true)
  .setFooter("Synox bot • Szerver Információ", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send({embed});
};
if(cmd === `${prefix}help`){
  const parancsok = (".parancsok")
  let help = new Discord.RichEmbed()
  .setColor("PINK")
  .setThumbnail(`${bot.user.displayAvatarURL}`)
  .setDescription(` ${bot.user.username} Help információ`)
  .addField("**Bug Jelentés menete:**","``Ha bármilyen bugot, találsz a botba azt jelentsd Bencee#6371-nek Discordon, vagy a Support Szerven``",  true)
  .addField(`${bot.user.username} **Fallen bot Hivatalos Discord szervere:**`, "``https://discord.gg/nEp2zuCJR``", true)
  .addField(`${bot.user.username} **Parancsok megnézése:**`, `${parancsok}`, false)
  message.channel.send(help)

}

if(cmd === `${prefix}parancsok`) {
  let embed = new Discord.RichEmbed()
  .setColor("BLACK")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .setThumbnail(bot.user.displayAvatarURL)
  .setDescription("``A Bot Parancsai``")
  .addField("💻Szerverrel kapcsolatos Parancsok💻:", ".Információk", true)
  .addField(" 🔧Moderációs Parancsok🔧:", ".Moderáció", true)
  .addField("🦴Fun Parancsok:🦴", ".fun", true)
  .setFooter("Synox bot • Bot Parancsok Listája", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if (cmd === `${prefix}Információk`) {
  let embed = new Discord.RichEmbed()
  .setColor("BLUE")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .addField("💻Szerverrel kapcsolatos Parancsok💻:", "``.botinfo, .szerverinfo, .userinfo``", true)
  .setFooter("Synox bot • 💻Szerverrel kapcsolatos Parancsok listája💻", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if (cmd === `${prefix}Moderáció`) {
  let embed = new Discord.RichEmbed()
  .setColor("BLUE")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .addField("🔧Moderációs Parancsok🔧:", "``.kick, .ban, .embedkick(EMBED!), .embedban(embed), .warn, .ütemezés, .Felhívás, .szavazás(Egyenlőre még csak moderátorok tudják használni!).clear, .addrole,.removerole, .mute, .unmute,.üzenet, .nickname, .szolgalat, .szolgalat-ki, .botstatus, .votekick``", true)
  .setFooter("Synox bot • 🔧Moderációs Parancsok listája🔧", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if (cmd === `${prefix}fun`) {
  let embed = new Discord.RichEmbed()
  .setColor("BLUE")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .addField("🦴Fun Parancsok:🦴", "``.cat, .dog, .meme, .kép, .dobokocka, .coin, .botpontok, .meghivás,.embedsay, .szia, .ping, .gyümölcsök, .say, .dm , .8ball(Kérdezős parancs!), .random, .avatar``", true)
  .setFooter("Synox bot •  🦴fun Parancsok listája🦴", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if (cmd === `${prefix}meghivás`) {
  let embed = new Discord.RichEmbed()
  .setColor("PINK")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .addField("Discord Bot meghívás ((link)):", "\n Bot Meghivás https://discord.com/api/oauth2/authorize?client_id=737243840284459019&permissions=8&scope=bot\n", true)
  .setFooter("Synox bot • bot meghivás", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if(cmd === `${prefix}userinfo`) {
  const member = getMember(message, args.join(" "));
  const roles = member.roles
   .filter(r => r.id !== message.guild.id)
   .map(r => r)
   .join(", ") || "none";
  let embed = new Discord.RichEmbed()
  .setColor("GREEN")
  .setTitle("**Játékos Információ**")
  .setDescription(`${message.author.username} játékosról a következő információt találtam:`)
  .setImage(message.author.displayAvatarURL)
  .setAuthor(`Szerver: ${message.guild.name}`, message.guild.iconURL)
  .addField("**>** **Discord Neve**", `${message.author.username}`, true)
  .addField("**>** **Discord # Száma**", `${message.author.discriminator}`, true)
  .addField("**>** **Discord Id-je**", `${message.author.id}`, true)
  .addField("**>** **Státusza**", `${message.author.presence.status}`, true)
  .addField("**>** **Éppen ezzel a játékkal játszik**", `${message.author.presence.game ? message.author.presence.game.name : "``Jelenleg nem játszik semmivel``"}`, true)
  .addField("**>** **Custom statusa**", `${message.author.presence.customstatus ? message.author.presence.customstatus : "``Nincs Custom Statusa``"}`, true)
  .addField("**>** **A Játékos jelenleg ezen a szerveren van**", `${message.guild.name}`, true)
  .addField("**>** **Rangjai**", `${roles}`, true)
  .addField("**>** **Játékos Discord Fiók Készítési ideje**", `${message.author.createdAt}`, true)
  .setFooter("Synox bot • Játékos Információ", bot.user.displayAvatarURL)
  .setTimestamp(); 

  message.channel.send(embed)
}
if(cmd === `${prefix}asddd`) {
  let embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`${message.guild.name}`, message.guild.iconURL)
  .setDescription("**Sziasztok!** Bot fejlesztési napló: .parancsok listája átírva, .kick, .ban parancs moderátoroknak, illetve adminoknak, üzenő, illetve távozó fal, .gyümölcsök parancs, Holnap a zene parancs, illetve a törlés parancs kerül be! Ha szeretnéd behívni a botot, akkor a .meghivás parancsal megteheted! Mindenkinek jó játékot kíván a Synox Discord Szerver Tulajdonosai!")
  .setFooter("Synox bot • bot fejlesztési napló", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if(cmd === `${prefix}cat`) {
  let msg = await message.channel.send("Készítés...");
 
    let {body} = await superagent
    .get('http://aws.random.cat/meow')
    console.log(body.file)
    if(!{body}) return message.channel.send("Nem találok. Probáld újra!")
 
       let cEmbed = new Discord.RichEmbed()
       .setColor('RANDOM')
       .setAuthor(`Synox Bot Cicás képek`, message.guild.iconURL)
       .setImage(body.file)
       .setTimestamp()
       .setFooter("Synox Bot Cicás képek", bot.user.displayAvatarURL)
 
       message.channel.send({embed: cEmbed})
 
       msg.delete();
}
if(cmd === `${prefix}szervericon`){
  const embed = new Discord.RichEmbed()
      .setTitle(`${message.guild.name} szerver iconja`)
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }

if(cmd === `${prefix}dobokocka`){
  let limit = args[0];
    if (!limit) limit = 1500;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0)
      return message.channel.send(message, 0, '❌Hiba! Adj meg egy számot! ❌');
    const embed = new Discord.RichEmbed()
      .setTitle('🎲  Dobokocka  🎲')
      .setDescription(`${message.member}, dobokocka száma: **${n}**!`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
   
if(cmd === `${prefix}warn`) {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
  if(!rUser) return message.channel.send("❌ Hiba! Nem tegelted meg a felhasználót! ❌")
  let reason = args.join(" ").slice(22);

  if (!reason) return message.reply('❌ Hiba! Kérlek add meg a warnolási indokot! ❌');
   
  let reportEmbed = new Discord.RichEmbed()
  .setDescription("Warn System")
  .setColor("RANDOM")
  .addField(" *>* Figyelmeztetett játékos", `${rUser} ID: ${rUser.id}`)
  .addField(" *>* Figyelmeztetést kiszabta", `${message.author} ID: ${message.author.id}`)
  .addField(" *>* Ebben a csatornában lett figyelmeztettve", message.channel)
  .addField(" *>* Figyelmeztetés időpontja ", message.createdAt)
  .addField(" *>* Indok: ", reason)
  .setFooter("Synox bot • warn system", bot.user.displayAvatarURL)
  .setTimestamp();

  let reportchannel = message.guild.channels.find(`name`, "warn")
  if(!reportchannel) return message.channel.send("❌ Hiba! Nemtaláltam a 'warn' csatornát! ❌")

  message.delete().catch(O_o=>{});
  reportchannel.send(reportEmbed);
  return
}
if(cmd === `${prefix}dog`) {
  let msg = await message.channel.send("Készítés...")
    let {body} = await superagent
    .get(`https://dog.ceo/api/breeds/image/random`)
    //console.log(body.message)
    if(!{body}) return message.channel.send("I broke ! Try again")
 
    let Embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`Synox Bot kutyás képek`, message.guild.iconURL)
    .setImage(body.message)
    .setTimestamp()
    .setFooter(`Synox Bot Kutyás képek`, bot.user.displayAvatarURL)
    message.channel.send(Embed)
    msg.delete()
}
if(cmd === `${prefix}coins`) {
  if(!coins[message.author.id]){
    coins[message.author.id] = {
      coins: 0
    };
  }

  let uCoins = coins[message.author.id].coins;


  let coinEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#00FF00")
  .addField("💸 Coinod:", uCoins)
  .setFooter(`Fallen Bot • Coins`, bot.user.displayAvatarURL)

  message.channel.send(coinEmbed);//.then(msg => {msg.delete(5000)});

}
if(cmd === `${prefix}botpontok`) {
  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
   };
 }
   let curxp = xp[message.author.id].xp;
   let curlvl = xp[message.author.id].level;
   let nxtLvlXp = curlvl * 300;
   let difference = nxtLvlXp - curxp;
 
   let lvlEmbed = new Discord.RichEmbed()
   .setAuthor(message.author.username)
   .setColor("BLACk")
   .addField("Bot Pont:", curlvl, true)
   .addField("Bot XP:", curxp, true)
   .setFooter(`${difference} Jelenleg ennyi Xp-je van! `, message.author.displayAvatarURL);
 
   message.channel.send(lvlEmbed); //.then(msg => {msg.delete(5000)});
 
}
if(cmd === `${prefix}votekick`){
  if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  const agree    = "✅";
  const disagree = "❎";
  if (message.mentions.users.size === 0){
    return message.reply("❌ " + "| Hiba! Tegelj meg egy felhasználót! ❌");
  }
  let reason = args.join(" ").slice(22);

  if (!reason) return message.reply('❌ Hiba! Kérlek add meg a kirugási indokot! ❌');

  let kickmember = message.guild.member(message.mentions.users.first());
  if(!kickmember){
    message.reply("❌ " + "| That User Does Not Seem Valid!");
  }

  if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")){
    return message.reply("❌ " + "| nincs jogod a parancs használatára! \"KICK_MEMBERS\"").catch(console.error);
  }

  let msg = await message.channel.send("60 Másodperc és véget ér a kirugási szavazás!");
  await msg.react(agree);
  await msg.react(disagree);

  const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 60000});
  msg.delete();

  var NO_Count = reactions.get(disagree).count;
  var YES_Count = reactions.get(agree);

  if(YES_Count == undefined){
    var YES_Count = 1;
  }else{
    var YES_Count = reactions.get(agree).count;
  }

  var sumsum = new Discord.RichEmbed()
  
            .addField("Szavazás végetért!:", "----------------------------------------\n" +
                                          "Végeredményi Szavazat (Nem): " + `${NO_Count-1}\n` +
                                          "Végeredményi Szavazat (Igen): " + `${YES_Count-1}\n` +
                                          "----------------------------------------\n" +
                                          "Üzenet: Szavazatra ennyi ember kell: (3+)\n" +
                                          "----------------------------------------", true)
                                          .addField("Kirugási Indok: ", reason)                              
            .setColor("0x#FF0000")
            .setFooter(`Fallen Bot • Votekick szavazás`, bot.user.displayAvatarURL)

  await message.channel.send({embed: sumsum});

  if(YES_Count >= 4 && YES_Count > NO_Count){

    kickmember.kick().then(member => {
      message.reply(`${member.user.username}, Kilett szavazva, ezért kickelve lett!`)
    })
  }else{

    message.channel.send("\n" + "❌ Szavazás véget ért, mert nem volt elegendő szavazat!");
  }

}
if(cmd === `${prefix}color`){
  try {
    const hex = Math.random().toString(16).slice(2, 8).toUpperCase().slice(-6);

    const color = !args[0] ? hex : args[0];
    const embed = new Discord.RichEmbed()
      .setColor(hex)
      .setDescription("Random HEX Code: #" + hex)
      .setTitle("#" + hex)
      .setImage(`https://tsuyobot.github.io/hex-to-img/?hex=${color}`);

    message.channel.send(embed);
  } catch (err) {
    message.channel.send("There was an error!\n" + err).catch();
  }
}

if(cmd === `${prefix}8ball`) {
  let question = message.content.split(`${prefix}8ball`).join(" ");
  let results = [`Nem tudom`, "Igen", "Nem", "Lehet", "Talán"]
  let result = Math.floor((Math.random() * results.length));

  let embed = new Discord.RichEmbed()
  .setColor("33FFE9")
  .setDescription("A 8ball command, egy kérdős parancs a bottol. a bot Igen, Nem, Nem tudom stb. parancsokkal tud válaszolni!")
  .setTitle(`8ball command`)
  .addField(`Kérdésed:`, question)
  .addField(`Bottol a válaszod:`, results[result])
  .setFooter(`Megkérdezte: ${message.author.tag}`, bot.user.displayAvatarURL)
  .setTimestamp();
  message.channel.send(embed)

  message.delete();
}
if(cmd === `${prefix}dm`){
  let aMember = message.mentions.members.first()
 
    let DMember = message.mentions.members.first() || message.guild.members.get(args[0]) 
    if(!DMember) return message.channel.send("❌ Hiba! Kérlek Emlísd meg egy játékost! ❌")
 
    let email = args.join(" ").slice(22);
    if(!email) return message.channel.send("❌ Hiba! Kérlek add meg az üzenet nevét!")
 
    let MSG = new Discord.RichEmbed()
    .setDescription(`${aMember}-től/-tól kaptál egy üzenetett. ` + ` Ezen a szerveren kaptál üzenetett: ${message.guild.name} ` + " | " + `Üzenet: ${email}`)
    .setColor("BLACK")
    .setFooter("Fallen bot • játékos üzenet")
    .setTimestamp();

    message.channel.send(`${aMember}-nak/-nek Sikeresen elküldted az üzenetett!`)
 
  
    DMember.send(MSG)
}
if(cmd === `${prefix}say`) {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("no");
  let botmessage = args.join(" ");
  message.delete().catch();
  message.channel.send(botmessage);
}
if(cmd === `${prefix}szavazás`) {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  const pollchannel = message.mentions.channels.first()
  if(!pollchannel) {
    return message.channel.send(`❌ Hiba! **Nem említetted meg a csatornát!** ❌`)
  }

  const question = args.join(" ").slice(21)
  if(!question) {
    return message.channel.send("❌ Hiba! **Nem adtad meg a szavazás nevét!** ❌")
  }

  let e = new Discord.RichEmbed()
  .setTitle(`Új szavazás indult el!`)
  .setDescription(`${question}`)
  .addField("A szavazást készítette:", message.author)
  .setColor("RANDOM")
  .setFooter("Synox bot • szavazás parancs", bot.user.displayAvatarURL)
  .setTimestamp();
  let msg = await pollchannel.send(e)
  await msg.react("👍")
  await msg.react("👎")
  message.channel.send("✅ Szavazás-t Sikeres létrehoztad! ✅")
  console.log("✅ Szavazás Sikeres! ✅")
}
if(cmd === `${prefix}Felhivás`) {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ Hiba! Nincs jogod a parancs használatára! ❌");
  const pollchannel = message.mentions.channels.first()
  if(!pollchannel) {
    return message.channel.send(`❌ Hiba! **Nem említetted meg a csatornát!** ❌`)
  }

  const question = args.join(" ").slice(21)
  if(!question) {
    return message.channel.send("❌ Hiba! **Nem adtad meg a felhívás nevét!** ❌")
  }

  let e = new Discord.RichEmbed()
  .setTitle(`Új felhívás indult el!`)
  .setDescription(`${question}`)
  .addField("A felhívást készítette:", message.author)
  .setColor("RANDOM")
  .setFooter("Synox bot • felhívásos parancs", bot.user.displayAvatarURL)
  .setTimestamp();
  let msg = await pollchannel.send(e)
  message.channel.send("✅ Felhívás-t Sikeres létrehoztad! ✅")
  console.log("✅ Felhívás Sikeres! ✅")
}
if(cmd === `${prefix}embedsay`) {
  let author = message.author;
 
        let description = args.slice(0).join(" ");
        if(!args[0]) return message.channel.send("❌ Hiba! Kérlek írj egy szöveget! ❌")
 
        let CustomEmbed = new Discord.RichEmbed()
        .setAuthor(`Üzenett írta: ${author.username}`)
        .setDescription(`Szöveg: ${description}`)
        .setThumbnail(author.displayAvatarURL)
        .setColor('RANDOM')
        .setFooter("Synox bot • embedsay")
        .setTimestamp();
 
        message.channel.send(CustomEmbed)
}
if(cmd === `${prefix}bothiba`) {
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
  if(!rUser) return message.channel.send("❌ Hiba! Nem tegelted meg a felhasználót! (CSAK A SYNOX BOTOT TEGELD!)❌")
  let reason = args.join(" ").slice(22);

  if (!reason) return message.reply('❌ Hiba! Nem adtad meg a bothiba szövegét (pl. .bothiba .say-ba hiba van! ❌'); 
  let reportEmbed = new Discord.RichEmbed()
  .setDescription("Bot Jelentés")
  .setColor("YELLOW")
  .addField(" *>* (Bot jelentés) Synox Bot jelentés", `${rUser} ID: ${rUser.id}`)
  .addField(" *>* (Bot jelentés) Szöveget írta:", `${message.author} ID: ${message.author.id}`)
  .addField(" *>* Ebben a csatornában lett kiírva a bothiba üzenet", message.channel)
  .addField(" *>* Bothiba szöveg időpontja ", message.createdAt)
  .addField(" *>* Ezen a szerveren lett jelentve a bot", `${message.guild.name}`)
  .addField(" *>* hiba indoka:", reason)
  .setFooter("Synox bot • bothiba jelentlés", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(`✅ ${message.author}, az üzenetedet sikeresen jelentettük a Tulajdonos/Fejlesztő felé! :) ✅`)
  let reportchannel = message.guild.channels.find(`name`, "bothiba")
  if(!reportchannel) return message.channel.send("❌ Hiba! Nemtaláltam a bothiba csatornát! ❌")      
  message.delete().catch(O_o=>{});
  reportchannel.send(reportEmbed);
  return
}
if(cmd === `${prefix}random`) {
  if(!args[0]) return message.reply("Random szám: 1")
  if(!args[1]) return message.reply("Random szám: 2")
  message.channel.send("A te random számod:" + Math.floor(Math.random() * args[1] + args[0]));
}
if(cmd ===  `${prefix}timer`){
  let Timer = args[0];

  if(!args[0]){
    return message.channel.send(":x: " + "| Please Enter a time period followed by \"s or m or h\"");
  }

  if(args[0] <= 0){
    return message.channel.send(":x: " + "| Please Enter a time period followed by \"s or m or h\"");
  }

  message.channel.send(":white_check_mark: " + "| Timer Started for: " + `${ms(ms(Timer), {long: true})}`)

  setTimeout(function(){
    message.channel.send(message.author.toString() + ` The Timer Has FINISHED!, it lasted: ${ms(ms(Timer), {long: true})}`)

  }, ms(Timer));
}
if (cmd === `${prefix}clear` || cmd === `${prefix}purge`){
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("❌ Hiba! Nincs jogosultságod a parancs használatához! ❌");
  if(!args[0]) return message.channel.send("❌ Hiba! Nem adtál meg egy számot! ❌ Használat: .clear (pl.10)");
  message.channel.bulkDelete(args[0]).catch(e => { message.channel.send("❌ Hiba! Nem tudok 100-nál nagyobb üzenetett törölni! ❌")});
  message.delete()
  message.channel.send(`Sikeresen kitörölve \`${args[0]} üzenet\``).then(m => m.delete({ timeout: 5000 }));
  message.reply(`Sikeresen kitöröltél \`${args[0]} üzenetet!\``)
  console.log(`Sikeresen kitöröltél ennyi üzenetet: \`${args[0]}!\``)
}
if(cmd === `${prefix}embedkick`){
  if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("❌ Hiba! Nincs jogod kirugni! ❌");
  let toKick = message.mentions.members.first();
  let reason = args.slice(1).join(" ");
  if(!args[0]) return message.channel.send('❌ Hiba! Tegeld meg, akit szeretnél kirugni! ❌');
  if(!toKick) return message.channel.send(`${args[0]} ❌ Hiba! Nem találtam ilyen felhasználót! ❌`);
  if(!reason) return message.channel.send('❌ Hiba! Kérlek add meg a kirugási indokot! ❌');

  if(!toKick.kickable){
      return message.channel.send('❌ Hiba! Nem tudod kirugni hiszen moderátor vagy admin rangja van! ❌');
  }

  if(toKick.kickable){
      let x = new Discord.RichEmbed()
      .setTitle('Kick')
      .addField('Kirugott játékos:', toKick)
      .addField('Kirugta:', message.author)
      .addField('Indok:', reason)
      .addField('Kickelve lett ekkor:', message.createdAt)
      .setColor("BLACK")
      .setFooter("Synox bot • kick embed command", bot.user.displayAvatarURL);

      message.channel.send(x);
      toKick.kick();
  }
}
if(cmd === `${prefix}embedban`){
  if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("❌ Hiba! Nincs jogod bannolni! ❌");
  let toBan = message.mentions.members.first();
  let reason = args.slice(1).join(" ");
  if(!args[0]) return message.channel.send('❌ Hiba! Tegeld meg, akit szeretnél bannolni! ❌');
  if(!toBan) return message.channel.send(`${args[0]} ❌ Hiba! Nem találtam ilyen felhasználót! ❌`);
  if(!reason) return message.channel.send('❌ Hiba! Kérlek add meg a bannolási indokot! ❌');

  if(!toBan.bannable){
      return message.channel.send('❌ Hiba! Nem tudod bannolni hiszen moderátor vagy admin rangja van! ❌');
  }

  if(toBan.bannable){
      let x = new Discord.RichEmbed()
      .setTitle('Ban')
      .addField('Bannolt játékos:', toBan)
      .addField('Bannolta:', message.author)
      .addField('Indok:', reason)
      .addField('Bannolva lett ekkor:', message.createdAt)
      .setColor("BLACK")
      .setFooter("Synox bot • ban embed command", bot.user.displayAvatarURL);

      message.channel.send(x);
      toBan.ban();
  }
}
if(cmd === `${prefix}helpaa`) {
  let embed = new Discord.RichEmbed()
  .setColor("BLUE")
  .setTitle("Help információ")
  .setAuthor(`${message.guild.name} Help Menü`, message.guild.iconURL)
  .setDescription("Ha bármilyen bugot, találsz a botba azt jelents a #bug-jelentés szobában, illetve bármilyen észrevételed, javaslatod van azt megírhatod a #javaslatok szobába. ((**PARANCS JELENLEG BÉTA VERZÍÓBA VAN! NEM VÁLTOZIK AZ ÁLLAPOTA, HAMAROSAN MEG LESZ OLDVA!**))")
  .addField("A bot parancsai:" , ".parancsok")
  .addField("Bot Állapota:", "✅ Elérhető")
  .addField("Bot Verzió", "V.01")
  .addField("Ennyi szerveren van:", `${bot.guilds.size}`)
  .addField("Bot prefix-je", `${prefix}`)
  .setFooter("Synox bot • help Információ", bot.user.displayAvatarURL)
  .setTimestamp();

  message.channel.send(embed)
}
if(cmd === `${prefix}unban`){
  if(!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("❌ Hiba! Nincs jogultságod a parancs használatára! ❌")
 
    let unbanMember = await bot.fetchUser(args[0])
   if(!unbanMember) return message.channel.send("La personne à unban est introuvable.")
 
   let reason = args.slice(1).join(" ")
   if(!reason) reason = "[JELENLEG FEJLESZTÉS ALATT!]"
   if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("Vérifier mes permissions")
 
    try{
        message.guild.unban(unbanMember, {reason: reason})
        message.channel.send(`${unbanMember} ✅ Sikeresen unbannolva! ✅`)
    } catch(e) {
        console.log(e.message)
    }
 
    let embed = new Discord.RichEmbed()
    .setColor("BLACK")
    .setAuthor(`${message.guild.name} Mod LOG`, message.guild.iconURL)
    .addField("**>** Moderáció :", "unban")
    .addField("**>** Discord Neve, Dicord Id-je :", `${unbanMember.username} (${unbanMember.id})`)
    .addField("**>** Unbannolta :", message.author.username)
    .addField("**>** Ezzel az indokkal lett bannolva :", reason)
    .setFooter("Synox bot • unbann command", bot.user.displayAvatarURL)
    .setTimestamp();
 
    let lChannel = message.guild.channels.find(c => c.name === "mod-log")
    lChannel.send(embed)
}
if(cmd === `${prefix}addrole`){
  if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("❌ Hiba nincs jogosultságod a parancs használatára! ❌")  
 
    let aMember = message.mentions.members.first()
    if(!aMember) return message.channel.send("❌ Hiba! Nem említetted meg a felhasználot! ❌")
    let role = message.guild.roles.find(r => r.name == args[1]) || message.guild.roles.find(r => r.id == args[1]) || message.mentions.roles.first()
    if(!role) return message.channel.send("❌ Hiba! Nem említetted meg a rangot! ❌")
 
    if(aMember.roles.has(role.id)) {
        return message.channel.send(`${aMember}-nak/-nek Sikeresen oda adtam a(z) **${role.name}** rangot! `)
    } else {
        await aMember.addRole(role.id)
        aMember.createDM().then( channel => {
            channel.send(` Sikeresen oda adta a bot a(z), **${role.name}** rangot! `)
        })
    }
	message.channel.send(`${aMember}-nak/-nek Sikeresen oda adtam a(z) **${role.name}** rangot! `)
}
if(cmd === `${prefix}removerole`){
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("❌ Hiba nincs jogosultságod a parancs használatára! ❌")
    
    let aMember = message.mentions.members.first()
    if(!aMember) return message.channel.send("❌ Hiba! Nem említetted meg a felhasználot! ❌")
    let role = message.guild.roles.find(r => r.name == args[1]) || message.guild.roles.find(r => r.id == args[1]) || message.mentions.roles.first()
    if(!role) return message.channel.send("❌ Hiba! Nem említetted meg a rangot! ❌")
 
    if(!aMember.roles.has(role.id)) {
        return message.channel.send(`${aMember}-ről Sikeresen levettem a(z) **${role.name}** rangot! `)
    } else {
        await aMember.removeRole(role.id)
        aMember.createDM().then( channel => {
            channel.send(`Sikeresen levette rólad a bot a(z), **${role.name}** rangot!`)
        })
    }
	message.channel.send(`${aMember}-ről Sikeresen levettem a(z) **${role.name}** rangot! `)
}
if(cmd === `${prefix}mute`){
  if(!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("❌ Hiba nincs jogosultságod a parancs használatára! ❌")
    if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("❌ Hiba nincs jogosultság a parancs használatára! Adminisztrátori jogosultságra van szükség! ❌")
 
    let mutee = message.mentions.members.first() || message.guild.members.get(args[0])
    if(!mutee) return message.channel.send("❌ Hiba! Emlísd meg egy játékost! ❌")
 
    let reason = args.slice(1).join(" ");
    if(!reason) reason = "Nincs indok csatolva!"
 
    let muterole = message.guild.roles.find(r => r.name === "Muted")
    if(!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "Muted",
                color: "Black",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    "READ_MESSAGES": true,
                    "SEND_MESSAGES": false,
                    "ADD_REACTIONS": false
                })
            })
        } catch(e) {
            console.log(e.stack);
        }
    }
    mutee.addRole(muterole.id).then(() => {
        message.delete()
 
        let MuteEmbed = new Discord.RichEmbed()
        .setDescription(`Mutolva lettél ezen a szerveren:  \`${message.guild.name}\` indok: **${reason}**`)
        .setColor("BLUE")
        .setFooter("Synox bot • mute értesítés", bot.user.displayAvatarURL)
        .setTimestamp();
 
        mutee.send(MuteEmbed).catch(err => console.log(err))
        message.channel.send(`${mutee.user.tag} Sikeresen mutolva!`)
        })
 
    let MuteLogEmbed = new Discord.RichEmbed()
    .setColor("BLUE")
    .setAuthor(`${message.guild.name} LOG`, message.guild.iconURL)
    .addField("Moderation :", "**MUTE**")
    .addField("Mutolva lett:", mutee.user.username)
    .addField("Mute-ot kiadta:", message.author.tag)
    .addField("Indok:", reason)
    .setFooter("Synox bot • mute command", bot.user.displayAvatarURL)
    .setTimestamp();
 
    let lChannel = message.guild.channels.find(c => c.name === "mod-log")
    lChannel.send(MuteLogEmbed)
}
if(cmd === `${prefix}unmute`){
  if(!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("❌ Hiba nincs jogosultságod a parancs használatára! ❌")
    if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("❌ Hiba nincs jogosultság a parancs használatára! Adminisztrátori jogosultságra van szükség! ❌")
 
    let mutee = message.mentions.members.first() || message.guild.members.get(args[0])
    if(!mutee) return message.channel.send("❌ Hiba! Kérlek Emlísd meg egy játékost! ❌")
 
    let muterole = message.guild.roles.find(r => r.name === "Muted")
    if(!muterole) return message.channel.send("A `Mute indokod` n'existe pas !")
 
    mutee.removeRole(muterole.id).then(() => {
        message.delete()
 
        let MuteEmbed = new Discord.RichEmbed()
        .setDescription(`Sikeresen umutolva lettél erről a szerverről: \`${message.guild.name}\``)
        .setColor("BLUE")
        .setFooter("Synox bot • unmute értesítés", bot.user.displayAvatarURL)
        .setTimestamp();
 
        mutee.send(MuteEmbed).catch(err => console.log(err))
        message.channel.send(`${mutee.user.tag} Sikeresen unmutolva!`)
        })
 
    let MuteLogEmbed = new Discord.RichEmbed()
    .setColor("BLUE")
    .setAuthor(`${message.guild.name} LOG`, message.guild.iconURL)
    .addField("Moderation:", "**UNMUTE**")
    .addField("Unmutolt Játékos:", mutee.user.username)
    .addField("Unmutolta:", message.author.tag)
    .setFooter("Synox bot • unmute command", bot.user.displayAvatarURL)
    .setTimestamp();
 
    let lChannel = message.guild.channels.find(c => c.name === "chat")
    if(!channel) return message.reply("❌ Hiba! Nem találtam a chat csatornát! ❌");
    message.guild.channels.send(muteembed)
    lChannel.send(MuteLogEmbed);
}
if(cmd === `${prefix}üzenet`){
  let aMember = message.mentions.members.first()
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ Hiba nincs jogosultságod a parancs használatára! ❌")
 
    let DMember = message.mentions.members.first() || message.guild.members.get(args[0]) 
    if(!DMember) return message.channel.send("❌ Hiba! Kérlek Emlísd meg egy játékost! ❌")
 
    let email = args.join(" ").slice(22);
    if(!email) return message.channel.send("❌ Hiba! Kérlek add meg az üzenet nevét!")
 
    let MSG = new Discord.RichEmbed()
    .setDescription("Egy Admintól kaptál egy Üzenetett! Ezen a szerveren kaptál  üzenetett: " + ` ${message.guild.name} ` + " | " + `Üzenet: ${email}`)
    .setColor("BLACK")
    .setFooter("Synox bot • admin üzenet")
    .setTimestamp();

    message.channel.send(`${aMember}-nak/-nek Sikeresen elküldted az üzenetett!`)
 
  
    DMember.send(MSG)
}
if(cmd === `${prefix}asdd`){
    const members = message.guild.members.cache;
    const channels = message.guild.channels.cache;
    const emojis = message.guild.emojis.cache;

    const embed = new Discord.RichEmbed()
      .setDescription(`**Guild information for __${message.guild.name}__**`)
      .setColor('BLUE')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('General', [
        `**❯ Name:** ${message.guild.name}`,
        `**❯ ID:** ${message.guild.id}`,
        `**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
        `**❯ Region:** ${regions[message.guild.region]}`,
        `**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
        `**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
        `**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
        `**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
        '\u200b'
      ])
      .addField('Statistics', [
        `**❯ Role Count:** ${roles.length}`,
        `**❯ Emoji Count:** ${emojis.size}`,
        `**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
        `**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
        `**❯ Member Count:** ${message.guild.memberCount}`,
        `**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
        `**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
        `**❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
        `**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
        `**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
        '\u200b'
      ])
      .addField('Presence', [
        `**❯ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
        `**❯ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
        `**❯ Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
        `**❯ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
        '\u200b'
      ])
      .addField(`Roles [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None')
      .setTimestamp();
    message.channel.send(embed);
}
if(cmd === `${prefix}nickname`){
  if(!message.member.hasPermissions('MANAGE_NICKNAMES')) return message.channel.send("❌ Hiba! Nincs jogosultságod a parancs használatára! ❌")
  const member = message.mentions.members.first();
  if(!member) return message.channel.send("❌ Hiba! Emlísd meg egy felhasználót! ❌");
  if(!args.slice(1).join(" ")) return message.channel.send(`❌ Hiba! Kérlek add meg, hogy mi legyen  ${member}-nak/-nek a beceneve! ❌`)
  member.setNickname(args.slice(1).join(" ")), message.channel.send(`Sikeresen átváltottad ${member}-nak/-nek a becenevét! Új beceneve: ${args.slice(1).join("")}`);
}
if(cmd === `${prefix}avatar`){
  let Embed = new Discord.RichEmbed()
  if(!message.mentions.users.first()){
    Embed.setTitle(`Te képed a Discordon:`);
    Embed.setImage(`${message.author.displayAvatarURL}`)
    Embed.setColor("BLACK")
    return message.channel.send(Embed);
  } else {
    let embed = new Discord.RichEmbed()
    let user = message.mentions.members.first();
    embed.setTitle(`${bot.users.cache.get(user.id).tags}`);
    embed.setImage(bot.users.cache.get(user.id).displayAvatarURL());
    embed.setColor("BLACK");
    return message.channel.send(embed)
  }
}
if(cmd === `${prefix}asd`){
  const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
  };
  
  const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
  };
  
  const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
  };
  
  module.exports = class extends Command {
  
    constructor(...args) {
      super(...args, {
        aliases: ['server', 'guild', 'guildinfo'],
        description: 'Displays information about the server that said message was run in.',
        category: 'Information'
      });
    }
  
    async run(message) {
      const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
      const members = message.guild.members.cache;
      const channels = message.guild.channels.cache;
      const emojis = message.guild.emojis.cache;
  
      const embed = new Discord.RichEmbed()
        .setDescription(`**Guild information for __${message.guild.name}__**`)
        .setColor('BLUE')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addField('General', [
          `**❯ Name:** ${message.guild.name}`,
          `**❯ ID:** ${message.guild.id}`,
          `**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
          `**❯ Region:** ${regions[message.guild.region]}`,
          `**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
          `**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
          `**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
          `**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
          '\u200b'
        ])
        .addField('Statistics', [
          `**❯ Role Count:** ${roles.length}`,
          `**❯ Emoji Count:** ${emojis.size}`,
          `**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
          `**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
          `**❯ Member Count:** ${message.guild.memberCount}`,
          `**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
          `**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
          `**❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
          `**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
          `**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
          '\u200b'
        ])
        .addField('Presence', [
          `**❯ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
          `**❯ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
          `**❯ Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
          `**❯ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
          '\u200b'
        ])
        .addField(`Roles [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None')
        .setTimestamp();
      message.channel.send(embed);
    }
  
  };
}  
});  


//say másik


//kick parancs
bot.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // If the message content starts with "!kick"
  if (message.content.startsWith('.kick')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member
          .kick('Nincs indok csatolva!')
          .then(() => {
            // We let the message author know we were able to kick the person
            message.reply(`✅ Sikeresen kirugtad ${user.tag}-t a szerverről! ✅`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
            message.reply('❌ Hiba! Nincs jogod kirugni! ❌');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("❌ Hiba! Ez a felhasználó nincs benne a szöveges csatornába! ❌");
      }
      // Otherwise, if no user was mentioned
    } else {
      message.reply("❌ Hiba! Nem említetted meg a felhasználót, akit kiszeretnél rugni! ❌");
    }
  }
});

//ban rendszer

bot.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // if the message content starts with "!ban"
  if (message.content.startsWith('.ban')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
         */
        member
          .ban({
            reason: 'Nincs indok csatolva!',
          })
          .then(() => {
            // We let the message author know we were able to ban the person
            message.reply(`✅ Sikeresen kibannoltad ${user.tag}-t a szerverről! ✅`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to ban the member,
            // either due to missing permissions or role hierarchy
            message.reply('❌ Hiba! Nincs jogod bannolni! ❌');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("❌ Hiba! Ez a felhasználó nincs benne a szöveges csatornába! ❌");
      }
    } else {
      // Otherwise, if no user was mentioned
      message.reply("❌ Hiba! Nem említetted meg a felhasználót, akit kiszeretnél bannolni! ❌");
    }
  }
});



//gyümölcsök

bot.on('message', async message => {
	if (message.content === '.gyümölcsök') {
		try {
			await message.react('🍎');
			await message.react('🍊');
			await message.react('🍇');
		} catch (error) {
			console.error('Csak egy emoji!');
		}
	}
});

//Aki belép a szerverre kap rangot


//tiltott szavak

bot.on("guildMemberAdd", member => {
  
  var role = member.guild.roles.find("name", "Játékos")
  member.addRole (role);
})

bot.on("guildMemberRemove", member =>{

})

//bot.on("message", message => {
  //if (message.author.bot) return;
  //if(message.author.id === "737243840284459019") return;

  //let szavak = ["csunya", "köcsög", "geci", "fasszopó", "ribanc", "kurva anyád", "anyád", "buzi"]
  //let talalt = false;

  //for (var a in szavak) {
  //  if (message.content.toLowerCase().includes(szavak[a].toLowerCase())) talalt = true;
 // }
  //if (talalt) {
  //  message.delete();
  //  message.author.send("[**BÉTA RENDSZER**] {**Synox Bot System**} ``Olyat Írtál a szerveren amit nem szabad!``")
  //}
//})

//belépés, kilépés
bot.on("guildMemberAdd", member => {
  const welcomeChannel = member.guild.channels.find(channel => channel.name === '👋ki-be')
  console.log(`${member} Belépett a szerverre!`)
})

bot.on("guildMemberRemove", member => {
  const welcomeChannel = member.guild.channels.find(channel => channel.name === '👋ki-be')
  welcomeChannel.send (`${member} Kilépett a szerverről!`)
  console.log(`${member} Kilépett a szerverről!`)
})

//Asd

bot.login('NzM3MjQzODQwMjg0NDU5MDE5.Xx6h1A.4oeEjlSALXve9PfEDbgSuLNWSBk');