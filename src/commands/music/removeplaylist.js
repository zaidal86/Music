import { createPlayListModel } from '../../models/createPlayList.js';
import mongoose from 'mongoose';
import sleep from '../../utils/sleep.js';

export const removeplaylist = {
    data: {
        name: 'removeplaylist',
        description: 'remove your playlist !',
        options: [{
            type: 3,
            name: 'playlist-name',
            description: 'Enter the name of your playList',
            required: true,
        }],
    },
    async execute(interaction) {
        const Playlist = mongoose.model(interaction.user.id, createPlayListModel);
        const title = interaction.options.get('playlist-name').value.toLowerCase();
        try {
            const data = await Playlist.findOneAndDelete({ title: title });
            if (data) {
                interaction.reply(`Playlist **${title}** supprimée avec succès.`);
                await sleep(5000)
                return interaction.deleteReply();
            } else {
                return interaction.reply({ content: `Aucune playlist portant le titre **${title}** n'a été trouvée.`, ephemeral: true });
            }
        } catch (error) {
            return interaction.reply({ content: `Erreur lors de la suppression de la playlist !`, ephemeral: true });
        };
    }
};