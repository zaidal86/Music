import { musicData } from '../models/musicData.js';
import mongoose from 'mongoose';
import sleep from '../utils/sleep.js';
import { getSameChannel } from '../utils/getSameOrOtherChannel.js';

const setVolume = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot\

    if (!player.hasPlayer()) return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });

    const DJTurntableID = mongoose.model('musicData', musicData);
    try {
        const data = await DJTurntableID.find({});

        if (data[0].volume >= 1) {
            interaction.reply('Le volume de la musique est deja a 100% !');
            await sleep(2000);
            return interaction.deleteReply();
        }
        const num = (parseFloat(data[0].volume) + (5 / 100)).toFixed(2) > 1 ? 1 : (parseFloat(data[0].volume) + (5 / 100)).toFixed(2)
        data[0].volume = num;
        await data[0].save();

        player.setVolume(parseFloat(data[0].volume));

        interaction.reply(`Le volume de la musique a ete ajuster a ${data[0].volume * 100}`);
        await sleep(2000);
        return interaction.deleteReply();
    } catch (error) {
        console.log(error);
    };
}

export const volumeP = async (interaction, player) => {
    setVolume(interaction, player)
};