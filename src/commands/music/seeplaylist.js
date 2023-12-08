import { createPlayListModel } from '../../models/createPlayList.js';
import { EmbedBuilder } from 'discord.js'
import mongoose from 'mongoose';
import sleep from '../../utils/sleep.js'

export const seeplaylist = {
    data: {
        name: 'seeplaylist',
        description: 'see your playlist',
        options: [{
            type: 5,
            name: 'all-collection',
            description: 'see all collection',
            required: false,
        }],
    },
    async execute(interaction) {
        if (interaction.options.get('all-collection')?.value || false) {
            try {
                const usersWithPlaylists = await mongoose.connection.db.listCollections().toArray();

                const playlistsInfo = [];

                for (const userCollection of usersWithPlaylists) {
                    const userId = userCollection.name;
                    const UserPlaylist = mongoose.model(userId, createPlayListModel);
                    const userPlaylists = await UserPlaylist.find({}).select('title');
                    playlistsInfo.push({ userId, userPlaylists });
                }

                if (playlistsInfo.length > 0) {
                    const results = playlistsInfo.map(info => `<@${info.userId}> : **${info.userPlaylists.map(p => p.title).join(', ')}** \n`);
                    const playListList = new EmbedBuilder()
                        .setAuthor({ name: 'Voici les playlists que tout le monde a créé !' })
                        .setColor('#1ABC9C')
                        .setDescription(`${results.join(' ')}`)
                        .setTimestamp();
                    interaction.reply({ embeds: [playListList] });
                    await sleep(5000)
                    return interaction.deleteReply();
                } else {
                    interaction.reply('Aucune playlist trouvée.');
                    await sleep(5000)
                    return interaction.deleteReply();
                }
            } catch (error) {
                console.error(error);
                interaction.reply('Une erreur s\'est produite lors de la récupération des playlists.');
                await sleep(5000)
                return interaction.deleteReply();
            }
        } else {

            const Playlist = mongoose.model(interaction.user.id, createPlayListModel);

            const data = await Playlist.find({});
            if (!data.length >= 1) return interaction.reply({ content: "Tu n'as toujours pas créer de playlist !", ephemeral: true });
            const playListString = [];
            for (let i = 0; i < data.length; i++) {
                playListString.push(`**${i + 1}.** Nom de la playlist: **${data[i].title.toUpperCase()}** / Date de creation: **${data[i].date}** \n`);
            }
            const playListList = new EmbedBuilder()
                .setAuthor({ name: 'Voici les playlist que tu as créé !' })
                .setColor('#1ABC9C')
                .setDescription(`${playListString.join(' ')}`)
                .setTimestamp();
            interaction.reply({ embeds: [playListList] });
            await sleep(5000)
            return interaction.deleteReply();
        }
    },
};