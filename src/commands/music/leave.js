import yasha from 'yasha';
import { removeQueue } from './utils/list.js';
import { getSameChannel } from '../../utils/getSameOrOtherChannel.js';
import sleep from '../../utils/sleep.js';

export const leave = {
    data: {
        name: 'leave',
        description: 'leave the channel !',
    },
    async execute(interaction, player) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
        if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

        player.destroy()
        yasha.VoiceConnection.disconnect(interaction.guild);
        removeQueue();
        interaction.reply('Le bot a été déconnecté du salon vocal.');
        await sleep(5000)
        return interaction.deleteReply();
    },
};