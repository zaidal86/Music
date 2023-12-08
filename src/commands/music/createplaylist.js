import { createPlayListModel } from '../../models/createPlayList.js';
import { dateString } from '../../utils/date.js';
import mongoose from 'mongoose';
import sleep from '../../utils/sleep.js';

export const createplaylist = {
    data: {
        name: 'createplaylist',
        description: 'Create your custom playlist !',
        options: [{
            type: 3,
            name: 'name',
            description: 'Enter the name of your playList',
            required: true,
        }],
    },
    async execute(interaction) {
        try {
            const Playlist = mongoose.model(interaction.user.id, createPlayListModel);
            const title = interaction.options.get('name').value.toLowerCase();

            const data = await Playlist.find({ title: title });
            if (data.length > 0) {
                return interaction.reply({ content: `Il y a deja une playlist a ce nom: **${title}**`, ephemeral: true });
            }

            const newPlaylist = new Playlist({
                title: title,
                date: dateString()
            });

            await newPlaylist.save();
            interaction.reply(`Votre playlist a été créée : **${interaction.options.get('name').value}**`);
            await sleep(5000)
            return interaction.deleteReply();
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'La création de la playlist a échoué !', ephemeral: true });
        }
    },
};