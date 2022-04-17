module.exports = {
    name: 'clear-queue',
    aliases: ['cq',"liste-sil","listetemizle"],

    execute(client, message) {
        if (!message.member.voice.channel) return message.channel.send(`** <a:no:878800816499204157> - Bir Sesli Kanala Bağlı Değilsin!**`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`** <a:no:878800816499204157> - Bulunduğun Sesli Kanala Giriş Yapmaya Yetkim Yok!**`);

        if (!client.player.getQueue(message)) return message.channel.send(`** <a:no:878800816499204157> - Şuanda Bir Müzik Çalmıyor!**`);

        if (client.player.getQueue(message).tracks.length <= 1) return message.channel.send(`** <a:no:878800816499204157> - Müzik Çalma Sırasında Sadece Bir Şarkı Var!**`);

        client.player.clearQueue(message);

        message.channel.send(`**${client.emotes.success} - Müzik Çalma Sırası Kaldırıldı!**`);
    },
};