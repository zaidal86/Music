import { createPlayListModel } from '../../models/createPlayList.js';
import mongoose from 'mongoose';
import sleep from '../../utils/sleep.js';

export const removesongstoplaylist = {
    data: {
        name: 'removesongstoplaylist',
        description: 'remove song to your playlist !',
        options: [{
            type: 3,
            name: 'playlist-name',
            description: 'Enter the name of your playList',
            required: true,
        },
        {
            type: 4,
            name: 'song-index',
            description: 'Enter the link of your music !',
            required: true,
            min_value: 1,
        }],
    },
    async execute(interaction) {
        const Playlist = mongoose.model(interaction.user.id, createPlayListModel);
        const title = interaction.options.get('playlist-name').value.toLowerCase();

        try {
            const data = await Playlist.findOne({ title: title });
            if (data) {
                const indexToRemove = interaction.options.get('song-index').value - 1;
                if (indexToRemove >= 0 && indexToRemove < data.songs.length) {
                    const songsTitle = `[${data.songs[indexToRemove].title}](${data.songs[indexToRemove].link})`;
                    data.songs.splice(indexToRemove, 1);
                    await data.save();
                    interaction.reply(`Vous venez de retirer la chanson **${songsTitle}** de votre playlist: **${title.toUpperCase()}**`);
                    await sleep(5000)
                    return interaction.deleteReply();
                } else {
                    return interaction.reply({ content: 'L\'index de la chanson à retirer est invalide.', ephemeral: true });
                }
            } else {
                return interaction.reply({ content: `Aucune playlist portant le titre **${title}** n'a été trouvée.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Erreur lors de la suppression de la chanson de votre playlist', ephemeral: true });
        }
    }
};