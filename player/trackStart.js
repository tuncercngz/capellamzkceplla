module.exports = (client, message, track) => {
    message.channel.send(`** <a:catt:877312769647575070> - Çalmaya Başladı \`${track.title}\` | Bağlanılan Kanal: <#${message.member.voice.channel.id}>**`);
};