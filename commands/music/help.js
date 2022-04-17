module.exports = {
    name: 'yardım',
    aliases: ["yardım","y","h"],

    execute(client, message, args) {

            message.channel.send({
            embed: {
                color: 'RANDOM',
                footer: { text: "ReS Soulfly Müzik Botu!" },
                description: `<a:tac:877317465284182056> **\`${client.config.discord.prefix}ara <müzik-ismi>\` | Müzik Ararsınız!
<a:tac:877317465284182056> \`${client.config.discord.prefix}skip\` | Çalan Müziği Atlar ve Diğerine Geçer!
<a:tac:877317465284182056> \`${client.config.discord.prefix}başlat <müzik-ismi>\` | Yazılan İsimdeki Müziği Çalar!
<a:tac:877317465284182056>\`${client.config.discord.prefix}dur\` | Çalan Müziği Durdurur!
<a:tac:877317465284182056>\`${client.config.discord.prefix}devam\` | Duran Müziği Geri Başlatır!
<a:tac:877317465284182056> \`${client.config.discord.prefix}döngü\` | Çalan Müziği Döngüye Sokar!
<a:tac:877317465284182056> \`${client.config.discord.prefix}döngü liste\` | Listedeki Tüm Müzikleri Döngüye Sokar!
<a:tac:877317465284182056> \`${client.config.discord.prefix}filtre <filtre-ismi>\` | Müziğe Efekt Filtre Ekler! (BASS, 8D vb.)
<a:tac:877317465284182056> \`${client.config.discord.prefix}filtreler\` | Aktif Filtreleri Gösterir!
<a:tac:877317465284182056> \`${client.config.discord.prefix}stop\` | Müzik Çalmayı Kapatır!
<a:tac:877317465284182056>\`${client.config.discord.prefix}karıştır\` | Listedeki Tüm Müziklerin Sırasını Karıştırır!
<a:tac:877317465284182056>\`${client.config.discord.prefix}liste-temizle\` | Listedeki Müzikleri Siler!
<a:tac:877317465284182056> \`${client.config.discord.prefix}ses\` | Ses Düzeyini Ayarlar (1 - 250)
<a:tac:877317465284182056>\`${client.config.discord.prefix}çalan\` | Çalan Müziğin Bilgilerini Verir!
<a:tac:877317465284182056> \`${client.config.discord.prefix}liste\` | Listedeki Müzikleri Gösterir!\n\nFiltre/Efektler: ${client.config.filters.map(cs => `\`${cs}\``).join(", ")}**`,
                timestamp: new Date(),
                title: `Müzik Komutları`,
            },
        });
      
    },
};