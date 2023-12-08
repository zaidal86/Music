import { createPlayListModel } from '../models/createPlayList.js';
import { getSameChannel } from '../utils/getSameOrOtherChannel.js';
import mongoose from 'mongoose';
import sleep from '../utils/sleep.js';
import { addToQueue } from '../commands/music/utils/list.js';

export const selectorplaylist = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot\

    if (!player.hasPlayer()) return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });

    const playlist = mongoose.model(interaction.user.id, createPlayListModel);
    const data = await playlist.find({});

    if (!(data.length > 0)) return interaction.reply({ content: 'vous ne possédez pas de playlist !', ephemeral: true });


    for (let index = 0; index < data.length; index++) {
        if (data[index].title == interaction.values) {
            for (let i = 0; i < data[index].songs.length; i++) {
                addToQueue(data[index].songs[i]);
            };
        };
    };

    interaction.reply(`Vous venez d'ajouter la playlist: **${interaction.values}** a la queue !`);
    await sleep(5000);
    interaction.deleteReply();
};