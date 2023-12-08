import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';
import { createPlayListModel } from '../models/createPlayList.js';
import { getSameChannel } from '../utils/getSameOrOtherChannel.js';
import mongoose from 'mongoose';
import sleep from '../utils/sleep.js';

export const playlist = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot\

    if (!player.hasPlayer()) return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });

    const playlist = mongoose.model(interaction.user.id, createPlayListModel);
    const data = await playlist.find({});

    if (!(data.length > 0)) return interaction.reply({ content: 'vous ne possédez pas de playlist !', ephemeral: true });


    const option = [];
    for (let index = 0; index < data.length; index++) {
        if (data[index].songs.length > 0) {
            option.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`Nom de ta playlist:  ${data[index].title}`)
                    .setDescription(`${data[index].date} / Nombre de musique: ${data[index].songs.length}`)
                    .setValue(data[index].title)
            )
        }
    }

    const select = new StringSelectMenuBuilder()
        .setCustomId('selectorplaylist')
        .setPlaceholder('voilà tes playlist !')
        .addOptions(option);

    const row = new ActionRowBuilder()
        .addComponents(select);

    await interaction.reply({
        content: '',
        components: [row],
    });

    await sleep(15000);

    interaction.deleteReply();
};