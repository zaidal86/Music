import { createPlayListModel } from '../../models/createPlayList.js';
import mongoose from 'mongoose';
import yasha from 'yasha';
import sleep from '../../utils/sleep.js';

export const addsongtoplaying = {
    data: {
        name: 'addsongtoplaying',
        description: 'add song to your playlist !',
        options: [{
            type: 3,
            name: 'playlist-name',
            description: 'Enter the name of your playList',
            required: true,
        },
        {
            type: 3,
            name: 'song-name',
            description: 'Enter the link of your music !',
            required: true,
        }],
    },
    async execute(interaction) {
        const pattern = /https:\/\/.*\.com/g;
        const matches = interaction.options.get('song-name').value.match(pattern);
        if (!matches) return interaction.reply({ content: 'Votre lien de correspond pas !', ephemeral: true });

        const track = await yasha.Source.resolve(interaction.options.get('song-name').value);
        if (!(track instanceof yasha.Track)) return interaction.reply({ content: 'La musique existe pas !', ephemeral: true });

        const Playlist = mongoose.model(interaction.user.id, createPlayListModel);
        const title = interaction.options.get('playlist-name').value.toLowerCase();
        try {
            const data = await Playlist.findOne({ title: title });
            if (data) {
                data.songs.push({
                    title: track.title,
                    author: track.author,
                    link: interaction.options.get('song-name').value,
                    duration: track.duration,
                    thumbnails: track.thumbnails[3] ? track.thumbnails[3].url : track.thumbnails[0].url
                });
                await data.save();
                interaction.reply(`Vous venez d'ajouter **${track.title}** dans la playlist: **${title.toUpperCase()}**`);
                await sleep(5000);
                return interaction.deleteReply();
            } else {
                return interaction.reply({ content: `Aucune playlist portant le titre **${title}** n'a été trouvée.`, ephemeral: true });
            }
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: `Erreur lors de l'enregistrement de votre musique`, ephemeral: true });
        };
    },
};