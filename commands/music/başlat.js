module.exports = {
    name: 'başlat',
    aliases: ['b',"başlat"],

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`** <a:no:878800816499204157> - Bir Sesli Kanala Bağlı Değilsin!**`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`**${client.emotes.error} - Bulunduğun Sesli Kanala Giriş Yapmaya Yetkim Yok!**`);

        if (!args[0]) return message.channel.send(`** <a:no:878800816499204157> - Lütfen Bir Şarkı İsmi Yaz!**`);

        client.player.play(message, args.join(" "), { firstResult: true });
    },
};