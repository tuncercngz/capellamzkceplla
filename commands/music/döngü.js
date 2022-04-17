module.exports = {
    name: 'loop',
    aliases: ['lp', 'repeat','döngü'],

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`** <a:no:878800816499204157> - Bir Sesli Kanala Bağlı Değilsin!**`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`** <a:no:878800816499204157> - Bulunduğun Sesli Kanala Giriş Yapmaya Yetkim Yok!**`);

        if (!client.player.getQueue(message)) return message.channel.send(`** <a:no:878800816499204157> - Şuanda Bir Müzik Çalmıyor!**`);

        if (args.join(" ").toLowerCase() === 'liste') {
            if (client.player.getQueue(message).loopMode) {
                client.player.setLoopMode(message, false);
                return message.channel.send(`** <a:guvenlik:877315668394000424> - Müzik Döngü Modu Kapatıldı!**`);
            } else {
                client.player.setLoopMode(message, true);
                return message.channel.send(`** <a:guvenlik:877315668394000424> - Müzik Döngü Modu Aktif Listedeki Tüm Müzikler Durmadan Tekrarlanacak!**`);
            };
        } else {
            if (client.player.getQueue(message).repeatMode) {
                client.player.setRepeatMode(message, false);
                return message.channel.send(`** <a:guvenlik:877315668394000424> - Müzik Döngü Modu Kapatıldı!**`);
            } else {
                client.player.setRepeatMode(message, true);
                return message.channel.send(`** <a:guvenlik:877315668394000424> - Müzik Döngü Modu Aktif Bu Müzik Durmadan Tekrarlanacak!**`);
            };
        };
    },
};