import { createPlayListModel } from '../../models/createPlayList.js';
import mongoose from 'mongoose';
import sleep from '../../utils/sleep.js';

export const editplaylist = {
    data: {
        name: 'editplaylist',
        description: 'remove your playlist !',
        options: [{
            type: 3,
            name: 'playlist-name',
            description: 'Enter the name of your playList',
            required: true,
        },
        {
            type: 3,
            name: 'new-name',
            description: 'Enter the name of your playList',
            required: true,
        }],
    },
    async execute(interaction) {
        const Playlist = mongoose.model(interaction.user.id, createPlayListModel);
        const title = interaction.options.get('playlist-name').value.toLowerCase();
        try {
            const data = await Playlist.findOne({ title: title });
            if (data) {
                data.title = interaction.options.get('new-name').value;
                data.save();
                interaction.reply(`Le nom de la playlist **${interaction.options.get('playlist-name').value}** a été changé pour: **${interaction.options.get('new-name').value}** !`);
                await sleep(5000)
                return interaction.deleteReply();
            } else {
                return interaction.reply({ content: `Aucune playlist portant le titre **${title}** n'a été trouvée.`, ephemeral: true });
            }
        } catch (error) {
            return interaction.reply({ content: `Erreur lors de la modification de la playlist !`, ephemeral: true });
        };
    }
};