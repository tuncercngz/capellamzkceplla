module.exports = {
    name: 'skip',
    aliases: ['sk',"geç","atla"],

    execute(client, message) {
        if (!message.member.voice.channel) return message.channel.send(`** <a:no:878800816499204157> - Bir Sesli Kanala Bağlı Değilsin!**`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`**${client.emotes.error} - Bulunduğun Sesli Kanala Giriş Yapmaya Yetkim Yok!**`);

        if (!client.player.getQueue(message)) return message.channel.send(`** <a:no:878800816499204157> - Şuanda Çalan Bir Müzik Yok!**`);

        const success = client.player.skip(message);

        if (success) message.channel.send(`** <a:guvenlik:877315668394000424> - Çalan Müzik Değiştirildi ve Sıradaki Diğer Müziğe Geçildi!**`);
    },
};