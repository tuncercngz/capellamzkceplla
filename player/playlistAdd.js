module.exports = (client, message, queue, playlist) => {
    message.channel.send(`**${client.emotes.music} - ${playlist.title} <a:guvenlik:877315668394000424> Müzik Çalma Sırasına Eklendi! \`(${playlist.tracks.length} Toplam Şarkı)\`**`);
};