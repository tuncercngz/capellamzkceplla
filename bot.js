const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
const Jimp = require("jimp");
const db = require("quick.db");
var prefix = ayarlar.prefix;

client.on("ready", () => {
  console.log(`Bot suan bu isimle aktif: ${client.user.tag}!`);
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

///////////// KOMUTLAR BAŞ

////////////// KOMUTLAR SON
////////////// ALTI ELLEME
require("./util/eventLoader")(client);

client.login(process.env.token);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});



//küfür engel //

const küfür = [
        "siktir",
        "fuck",
        "puşt",
        "pust",
        "piç",
        "sikerim",
        "sik",
        "yarra",
        "yarrak",
        "amcık",
        "orospu",
        "orosbu",
        "orosbucocu",
        "oç",
        "mahmutuncer",
        "mahmut tuncer",
        "mahmut tuncay",
        "Mahmut tuncer",
        ".oc",
        "ibne",
        "yavşak",
        "bitch",
        "dalyarak",
        "amk",
        "awk",
        "taşak",
        "taşşak",
        "daşşak",
		"sikm",
		"sikim",
		"sikmm",
		"skim",
		"skm",
		"sg"
      ];
client.on("messageUpdate", async (old, nev) => {
  
    if (old.content != nev.content) {
    let i = await db.fetch(`küfür.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`küfür.${nev.member.guild.id}.kanal`);
   if (i) {
      
      if (küfür.some(word => nev.content.includes(word))) {
      if (nev.member.hasPermission("BAN_MEMBERS")) return ;
       //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
 const embed = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` ${nev.author} , **Mesajını editleyerek küfür etmeye çalıştı!**`)
            .addField("Mesajı:",nev)
        
            nev.delete();
            const embeds = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` ${nev.author} , **Mesajı editleyerek küfür etmene izin veremem!**`) 
          client.channels.cache.get(y).send(embed)
            nev.channel.send(embeds).then(msg => msg.delete({timeout:5000}));
          
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async msg => {

     
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
         let y = await db.fetch(`küfür.${msg.member.guild.id}.kanal`);
   
    let i = await db.fetch(`küfür.${msg.member.guild.id}.durum`);
          if (i) {
              if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
                try {
                 if (!msg.member.hasPermission("MANAGE_GUILD")) {
                 //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
     msg.delete({timeout:750});
                    const embeds = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` <@${msg.author.id}> , **Bu sunucuda küfür yasak! <a:no:878800816499204157> **`)
      msg.channel.send(embeds).then(msg => msg.delete({timeout: 5000}));
                const embed = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` ${msg.author} , **Küfür etmeye çalıştı!**`) .addField("Mesajı:",msg)
               client.channels.cache.get(y).send(embed)
                  }              
                } catch(err) {
                  console.log(err);
                }
              }
          }
         if(!i) return ;
});

//küfür engel son //

//---------------sa as----------------//
client.on("message", async msg => {
 
 
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
    if (i == 'acik') {
      if (msg.content.toLowerCase() == 'sa' || msg.content.toLowerCase() == 's.a' || msg.content.toLowerCase() == 'selamun aleyküm' || msg.content.toLowerCase() == 'sea'|| msg.content.toLowerCase() == 'selam') {
          try {
 
                  return msg.reply(
                    'Aleyküm Selam, Hoşgeldin Nasılsın ? <a:emoji_40:845054235045396492>')
          } catch(err) {
            console.log(err);
          }
      }
    }
    else if (i == 'kapali') {
   
    }
    if (!i) return;
 
    });

//------------------sese sokma------------//
client.on("ready", () => {
  client.channels.cache.get("953809092625973318").join();
})


//---------iltifat------------//

const iltifatlar = [
  ' Gözlerindeki saklı cenneti benden başkası fark etsin istemiyorum. ',
  ' Sen benim düşlerimin surete bürünmüş halisin. ',
  ' Gülüşünde nice ilaçlar var yarama merhem olan. ',
  ' Mükemmeli sende gördüm ben. Kusursuz kelimesinin tam karşılığısın gönlümde. ',
  ' Daima yanımda olacağını biliyorum. Çünkü sen gerçek bir dostsun.  ”',
  ' Huzur kokuyor geçtiğin her yer. ”',
  ' Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.  ”',
  ' Güneşi olmayan kalbe gökkuşağı açtırdın güzel insan.  ',
  ' Seni gören kelebekler, narinliğin karşısında mest olur.”',
  ' Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı. ”',
  ' Gözlerinin hareketi bile yeter  benim aklımı başımdan almaya. ”',
  ' Sen gözlerime her baktığında kalbim özgürlüğe kanat çırpan bir kuş misali heyecanlı ama bir o kadar da ürkek.  ”',
  ' Hediyelerin en güzelini almak istiyorum sana. Teninin üzerine gül yaprakları dökmek, ayağının altına.  ',
  ' Mantının yanına yoğurt benim yanıma sen yakışıyorsun bebeğim.  ',
  ' Gökkuşağının bütün renkleri saklıydı gülüşünde.  ',
  ' Şimdi ben sana ne şiir yazsam, mutlaka kusurlu kalacak güzelliğinin yanında. Demem o ki; bırak yazdıklarımı, aç Kur’an-ı Kerim oku sevgilim!.  ',
  ' Şafak vakti yağan çiğ tanesi kadar masum, gün batımında denizlerden esen rüzgar kadar çılgın ve okyanusun derinliklerindeki inci taneleri kadar özelsin.  ',
  ' Dünyada 2 tane gül olsun 1 kırmızı 1 beyaz olsun sen beni unutursan kırmızı güller solsun ama ben seni unutursam beyaz güller KEFENİM OLSUN.  ',
  
];
// İLTİFATLARI BU ŞEKİLDE İSTEDİĞİNİZ KADAR ÇOĞALTABİLİRSİNİZ
client.on("message", async message => {
  if(message.channel.id !== "") return;
  let izex = db.get('chatiltifat');
  await db.add("chatiltifat", 1);
  if(izex >= 50) { // 50 yazan yer, 50 mesajda bir iltifat edeceğini gösterir, değiştirebilirsiniz.
    db.delete("chatiltifat");
    const random = Math.floor(Math.random() * ((iltifatlar).length - 1) + 1);
    message.reply(`**${(iltifatlar)[random]}**`);
  };
});



//---------------oto cevap--------//


client.on("message", message => {
    if(message.content.toLowerCase() == "merhaba") 
    return message.channel.send(`Merhaba hoş geldin nasılsın kuzum`)
});



client.on("message", message => {
    if(message.content.toLowerCase() == "selam aleyküm") 
    return message.channel.send(`Aleyküm  selam :)`)
});


client.on("message", message => {
    if(message.content.toLowerCase() == "naber") 
    return message.channel.send(`iyi senden naber`)
});


client.on("message", message => {
    if(message.content.toLowerCase() == "iyi geceler") 
    return message.channel.send(`Yüreğin doğan güneşi değil batan Güneşi seçsin, çünkü doğan güneş elbet batacaktır ama batan Güneş yeni umutlarla doğacaktır.

Yarınki Güneş senin için doğsun birtanem iyi geceler. <a:695921431346937906:845054234064191509>`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "İyi geceler") 
    return message.channel.send(`Yüreğin doğan güneşi değil batan Güneşi seçsin, çünkü doğan güneş elbet batacaktır ama batan Güneş yeni umutlarla doğacaktır.

Yarınki Güneş senin için doğsun birtanem iyi geceler. <a:695921431346937906:845054234064191509>`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "günaydın") 
    return message.channel.send(`Günaydın kanki nasılsın? <a:emoji_40:845054235045396492> `)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "Günaydın") 
    return message.channel.send(`Günaydın kanki nasılsın? <a:emoji_40:845054235045396492> `)
});



client.on("message", message => {
    if(message.content.toLowerCase() == "tag") 
    return message.channel.send(`⚝`)
});

//// otorol sistemi

client.on("guildMemberAdd", async member => {
  let kanal = await db.fetch(`otoRK_${member.guild.id}`);
  let rol = await db.fetch(`otoRL_${member.guild.id}`);
  let mesaj = db.fetch(`otoRM_${member.guild.id}`);
  if (!rol) return;
const asreaper = new Discord.MessageEmbed()
.setColor("BLUE")
.setTimestamp()
.setFooter(`Asreaper`)
.setDescription( " **" +
          member.user.username +
          "** hoş geldin! Otomatik rolün verildi. Seninle beraber **" +
          member.guild.memberCount +
          " **kişiyiz!")
  if (!mesaj) {
    client.channels.cache
      .get(kanal)
      .send(asreaper);
    return member.roles.add(rol);
  }

  if (mesaj) {
    var mesajs = mesaj
      .replace("-uye-", `${member.user}`)
      .replace("-uyetag-", `${member.user.tag}`)
      .replace("-rol-", `${member.guild.roles.cache.get(rol).name}`)
      .replace("-server-", `${member.guild.name}`)
      .replace("-uyesayisi-", `${member.guild.memberCount}`)
      .replace(
        "-botsayisi-",
        `${member.guild.members.cache.filter(m => m.user.bot).size}`
      )
      .replace("-bolge-", `${member.guild.region}`)
      .replace("-kanalsayisi-", `${member.guild.channels.cache.size}`);
    member.roles.add(rol);
    return client.channels.cache.get(kanal).send(mesajs);
  }
});



//-----------------------sahip hg--------------//
client.on("guildMemberAdd", member => {
  if (member.id !== '460210636329058325') return;
  let channels = member.guild.channels.cache.filter(channel => channel.permissionsFor(client.user.id).has("SEND_MESSAGES") && channel.type === "text");
  if (!channels) return;
  let ch = channels.random();
  ch.send(`Açılın! Sahibim ${member.user.tag} sunucuya katıldı!`);
  member.send("Hoş geldin sahip!");
  return;
});





///reklam-engel

const reklam = [
  ".com",
  ".net",
  ".xyz",
  ".tk",
  ".pw",
  ".io",
  ".me",
  ".gg",
  "www.",
  "https",
  "http",
  ".gl",
  ".org",
  ".com.tr",
  ".biz",
  "net",
  ".rf",
  ".gd",
  ".az",
  ".party",
".gf",
".31"
];
client.on("messageUpdate", async (old, nev) => {

if (old.content != nev.content) {
let i = await db.fetch(`reklam.${nev.member.guild.id}.durum`);
let y = await db.fetch(`reklam.${nev.member.guild.id}.kanal`);
if (i) {

if (reklam.some(word => nev.content.includes(word))) {
if (nev.member.hasPermission("BAN_MEMBERS")) return ;
 //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
const embed = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` ${nev.author} , **Mesajını editleyerek reklam yapmaya çalıştı!**`)
      .addField("Mesajı:",nev)
  
      nev.delete();
      const embeds = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` ${nev.author} , **Mesajı editleyerek reklam yapamana izin veremem!**`) 
    client.channels.cache.get(y).send(embed)
      nev.channel.send(embeds).then(msg => msg.delete({timeout:5000}));
    
}
} else {
}
if (!i) return;
}
});

client.on("message", async msg => {


if(msg.author.bot) return;
if(msg.channel.type === "dm") return;
   let y = await db.fetch(`reklam.${msg.member.guild.id}.kanal`);

let i = await db.fetch(`reklam.${msg.member.guild.id}.durum`);
    if (i) {
        if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
          try {
           if (!msg.member.hasPermission("MANAGE_GUILD")) {
           //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
msg.delete({timeout:750});
              const embeds = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` <@${msg.author.id}> , **Bu sunucuda reklam yapmak yasak!**`)
msg.channel.send(embeds).then(msg => msg.delete({timeout: 5000}));
          const embed = new Discord.MessageEmbed() .setColor(0x36393F) .setDescription(` ${msg.author} , **Reklam yapmaya çalıştı!**`) .addField("Mesajı:",msg)
         client.channels.cache.get(y).send(embed)
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
   if(!i) return ;
});


//reklam engel son //


//caps look//

client.on("message", async msg => {
    if (msg.channel.type === "dm") return;
      if(msg.author.bot) return;  
        if (msg.content.length > 4) {
         if (db.fetch(`capslock_${msg.guild.id}`)) {
           let caps = msg.content.toUpperCase()
           if (msg.content == caps) {
             if (!msg.member.hasPermission("ADMINISTRATOR")) {
               if (!msg.mentions.users.first()) {
                 msg.delete()
                 return msg.channel.send(`✋ ${msg.author}, Bu sunucuda, büyük harf kullanımı engellenmekte!`).then(m => m.delete(5000))
     }
       }
     }
   }
  }
});
 




//uptime 7/24//
const express = require("express");
const http = require("http");
const app = express();
 
app.get("/", (request, response) => {
  //console.log(Date.now() + " BOT Aktif.");
  //response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_NAME}.glitch.me`);
}, 1000 * 60 * 3);


//7/24//
const kontrol = require('node-fetch');
setInterval(() => {
kontrol("https://ressoulflydiscordbotuv12publicbotu.glitch.me/")  
console.log(`ReS Soulfly Sayesinde 7/24 !!`)
}, 3000)


var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});




//sayaç//

client.on("message", async message => {
  if (!message.guild) return;

  if (db.has(`sayac_${message.guild.id}`) === true) {
    if (db.fetch(`sayac_${message.guild.id}`) <= message.guild.members.cache.size) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Tebrikler ${message.guild.name}!`)
        .setDescription(`Başarıyla \`${db.fetch(`sayac_${message.guild.id}`)}\` kullanıcıya ulaştık! Sayaç sıfırlandı!`)
        .setColor("RANDOM");
      message.channel.send(embed);
      message.guild.owner.send(embed);
      db.delete(`sayac_${message.guild.id}`);
    }
  }
});
client.on("guildMemberRemove", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucudan ayrıldı! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});
client.on("guildMemberAdd", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucuya Katıldı :tada:! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});



// spam engel

const dctrat = require('dctr-antispam.js'); 

var authors = [];
var warned = [];

var messageLog = [];

client.on('message', async message => {
const spam = await db.fetch(`spam.${message.guild.id}`);
if(!spam) return;
const maxTime = await db.fetch(`max.${message.guild.id}.${message.author.id}`);
const timeout = await db.fetch(`time.${message.guild.id}.${message.author.id}`);
db.add(`mesaj.${message.guild.id}.${message.author.id}`, 1)
if(timeout) {
const sayı = await db.fetch(`mesaj.${message.guild.id}.${message.author.id}`);
if(Date.now() < maxTime) {
  const asreaper = new Discord.MessageEmbed()
  .setColor(0x36393F)
  .setDescription(` <@${message.author.id}> , **Bu sunucuda spam yapmak yasak!**`)
 // .setFooter(`Bu mesaj otomatik olarak silinecektir.`)
 if (message.member.hasPermission("BAN_MEMBERS")) return ;
 message.channel.send(asreaper).then(msg => msg.delete({timeout: 1500}));
  return message.delete();
  
}
} else {
db.set(`time.${message.guild.id}.${message.author.id}`, 'ok');
db.set(`max.${message.guild.id}.${message.author.id}`, Date.now()+3000);
setTimeout(() => {
db.delete(`mesaj.${message.guild.id}.${message.author.id}`);
db.delete(`time.${message.guild.id}.${message.author.id}`);
}, 500) // default : 500
}


});


/////


/// modlog sistemi

client.on("messageDelete", async (message) => {

  if (message.author.bot || message.channel.type == "dm") return;

  let log = message.guild.channels.cache.get(await db.fetch(`log_${message.guild.id}`));

  if (!log) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Mesaj Silindi")

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "")

  log.send(embed)

})

client.on("messageUpdate", async (oldMessage, newMessage) => {

  let modlog = await db.fetch(`log_${oldMessage.guild.id}`);

  if (!modlog) return;

  let embed = new Discord.MessageEmbed()

  .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

  .addField("**Eylem:**", "Mesaj Düzenleme")

  .addField("**Mesajın sahibi:**", `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`)

  .addField("**Eski Mesajı:**", `${oldMessage.content}`)

  .addField("**Yeni Mesajı:**", `${newMessage.content}`)

  .setTimestamp()

  .setColor(0x36393F)

  .setFooter(`Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`, oldMessage.guild.iconURL())

  .setThumbnail(oldMessage.guild.iconURL)

  client.channels.cache.get(modlog).send(embed)

});

client.on("channelCreate", async(channel) => {

  let modlog = await db.fetch(`log_${channel.guild.id}`);

    if (!modlog) return;

    const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());

    let kanal;

    if (channel.type === "text") kanal = `<#${channel.id}>`

    if (channel.type === "voice") kanal = `\`${channel.name}\``

    let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Oluşturma")

    .addField("**Kanalı Oluşturan Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturduğu Kanal:**", `${kanal}`)

    .setTimestamp()

    .setColor(0x36393F)

    .setFooter(`Sunucu: ${channel.guild.name} - ${channel.guild.id}`, channel.guild.iconURL())

    .setThumbnail(channel.guild.iconUR)

    client.channels.cache.get(modlog).send(embed)

    })

client.on("channelDelete", async(channel) => {

  let modlog = await db.fetch(`log_${channel.guild.id}`);

    if (!modlog) return;

    const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());

    let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Silme")

    .addField("**Kanalı Silen Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen Kanal:**", `\`${channel.name}\``)

    .setTimestamp()

    .setColor(0x36393F)

    .setFooter(`Sunucu: ${channel.guild.name} - ${channel.guild.id}`, channel.guild.iconURL())

    .setThumbnail(channel.guild.iconURL)

    client.channels.cache.get(modlog).send(embed)

    })

client.on("roleCreate", async(role) => {

let modlog = await db.fetch(`log_${role.guild.id}`);

if (!modlog) return;

const entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Rol Oluşturma")

.addField("**Rolü oluşturan kişi:**", `<@${entry.executor.id}>`)

.addField("**Oluşturulan rol:**", `\`${role.name}\` **=** \`${role.id}\``)

.setTimestamp()

.setFooter(`Sunucu: ${role.guild.name} - ${role.guild.id}`, role.guild.iconURL)

.setColor(0x36393F)

.setThumbnail(role.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("roleDelete", async(role) => {

let modlog = await db.fetch(`log_${role.guild.id}`);

if (!modlog) return;

const entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Rol Silme")

.addField("**Rolü silen kişi:**", `<@${entry.executor.id}>`)

.addField("**Silinen rol:**", `\`${role.name}\` **=** \`${role.id}\``)

.setTimestamp()

.setFooter(`Sunucu: ${role.guild.name} - ${role.guild.id}`, role.guild.iconURL)

.setColor(0x36393F)

.setThumbnail(role.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiCreate", async(emoji) => {

let modlog = await db.fetch(`log_${emoji.guild.id}`);

if (!modlog) return;

const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Emoji Oluşturma")

.addField("**Emojiyi oluşturan kişi:**", `<@${entry.executor.id}>`)

.addField("**Oluşturulan emoji:**", `${emoji} - İsmi: \`${emoji.name}\``)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`, emoji.guild.iconURL)

.setThumbnail(emoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiDelete", async(emoji) => {

let modlog = await db.fetch(`log_${emoji.guild.id}`);

if (!modlog) return;

const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Emoji Silme")

.addField("**Emojiyi silen kişi:**", `<@${entry.executor.id}>`)

.addField("**Silinen emoji:**", `${emoji}`)

.setTimestamp()

.setFooter(`Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`, emoji.guild.iconURL)

.setColor(0x36393F)

.setThumbnail(emoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiUpdate", async(oldEmoji, newEmoji) => {

let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

if (!modlog) return;

const entry = await oldEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Emoji Güncelleme")

.addField("**Emojiyi güncelleyen kişi:**", `<@${entry.executor.id}>`)

.addField("**Güncellenmeden önceki emoji:**", `${oldEmoji} - İsmi: \`${oldEmoji.name}\``)

.addField("**Güncellendikten sonraki emoji:**", `${newEmoji} - İsmi: \`${newEmoji.name}\``)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`, oldEmoji.guild.iconURL)

.setThumbnail(oldEmoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("guildBanAdd", async(guild, user) => {

let modlog = await db.fetch(`log_${guild.id}`);

if (!modlog) return;

const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Yasaklama")

.addField("**Kullanıcıyı yasaklayan yetkili:**", `<@${entry.executor.id}>`)

.addField("**Yasaklanan kullanıcı:**", `**${user.tag}** - ${user.id}`)

.addField("**Yasaklanma sebebi:**", `${entry.reason}`)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

.setThumbnail(guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("guildBanRemove", async(guild, user) => {

let modlog = await db.fetch(`log_${guild.id}`);

if (!modlog) return;

const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE"}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Yasak kaldırma")

.addField("**Yasağı kaldıran yetkili:**", `<@${entry.executor.id}>`)

.addField("**Yasağı kaldırılan kullanıcı:**", `**${user.tag}** - ${user.id}`)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

.setThumbnail(guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})
// mod log son ///




//güvenlik şüpeli hesab//
client.on('guildMemberAdd', member => {
     let kanal = db.fetch(`güvenlik.${member.guild.id}`)
     if(!kanal) return;

       let aylar = {
               "01": "Ocak",
               "02": "Şubat",
               "03": "Mart",
               "04": "Nisan",
               "05": "Mayıs",
               "06": "Haziran",
               "07": "Temmuz",
               "08": "Ağustos",
               "09": "Eylül",
               "10": "Ekim",
               "11": "Kasım",
               "12": "Aralık"
    }

  let bitiş = member.user.createdAt
      let günü = moment(new Date(bitiş).toISOString()).format('DD')
      let ayı = moment(new Date(bitiş).toISOString()).format('MM').replace("01", "Ocak").replace("02","Şubat").replace("03","Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10","Ekim").replace("11","Kasım").replace("12","Aralık").replace("13","CodAre")//codare
     let yılı =  moment(new Date(bitiş).toISOString()).format('YYYY')
     let saati = moment(new Date(bitiş).toISOString()).format('HH:mm')

let günay = `${günü} ${ayı} ${yılı} ${saati}`  

      let süre = member.user.createdAt
      let gün = moment(new Date(süre).toISOString()).format('DD')
      let hafta = moment(new Date(süre).toISOString()).format('WW')
      let ay = moment(new Date(süre).toISOString()).format('MM')
      let ayy = moment(new Date(süre).toISOString()).format('MM')
      let yıl =  moment(new Date(süre).toISOString()).format('YYYY')
     let yıl2 = moment(new Date().toISOString()).format('YYYY')

     let netyıl = yıl2 - yıl

     let created = ` ${netyıl} yıl  ${ay} ay ${hafta} hafta ${gün} gün önce`

     let kontrol;
     if(süre < 1296000000) kontrol = 'Bu hesap şüpheli!'
     if(süre > 1296000000) kontrol = 'Bu hesap güvenli!'

     let codare = new Discord.MessageEmbed()
     .setColor('RED')
     .setTitle(`${member.user.username} Katıldı`)
     .setDescription('<@'+member.id+'> Bilgileri : \n\n  Hesap oluşturulma tarihi **[' + created + ']** (`' + günay + '`) \n\n Hesap durumu : **' + kontrol + '**')//codare
     .setTimestamp()
     client.channels.cache.get(kanal).send(codare)
})



///afk sistemi//

client.on("message" , async msg => {
  
  if(!msg.guild) return;
  if(msg.content.startsWith(ayarlar.prefix+"afk")) return; 
  
  let afk = msg.mentions.users.first()
      //çalmayın lan
  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`)     //çalmayın
  
  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`)
 if(afk){
   const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`)
   const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`)
   if(msg.content.includes(kisi3)){

       msg.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`<@` + msg.author.id + `> Etiketlediğiniz Kişi Afk \nSebep : ${sebep}`))
   }
 }
  if(msg.author.id === kisi){
    //çalmağ
       msg.channel.send(new Discord.MessageEmbed().setColor('GREEN').setDescription(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`))
   db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkid_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`)
    msg.member.setNickname(isim)
    //resclassekibi
  }
  
});
 


//BOT ENGEL,anti-baskın yada anti-raid
client.on("guildMemberAdd", async member => {
let kanal = await db.fetch(`antiraidK_${member.guild.id}`)== "anti-raid-aç"
  if (!kanal) return;  
  var cod = member.guild.owner
  if (member.user.bot === true) {
     if (db.fetch(`botizin_${member.guild.id}.${member.id}`) == "aktif") {
    let are = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL)
      .setDescription(`**${member.user.tag}** (${member.id}) Adlı bota bir yetkili verdi eğer kaldırmak istiyorsanız **${prefix}bot-izni kaldır botun_id**.`);
    cod.send(are);
     } else {
       let izinverilmemişbot = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL)
      .setDescription("**" + member.user.tag +"**" + " (" + member.id+ ") " + "Adlı bot sunucuya eklendi ve banladım eğer izin vermek istiyorsanız **" + prefix + "bot-izni ver botun_id**")
       member.ban();// Eğer sunucudan atmak istiyorsanız ban kısmını kick yapın
       cod.send(izinverilmemişbot)
}
  }
});


