import { getSameChannel } from '../utils/getSameOrOtherChannel.js';
import yasha from 'yasha';
import { removeQueue } from '../commands/music/utils/list.js';
import { getDJMessageID } from './utils/getDJMessageID.js';

export const leavemusic = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot\

    if (player.hasPlayer()) {
        player.cleanup();
        player.destroy();
        yasha.VoiceConnection.disconnect(interaction.guild);

        removeQueue();

        return await getDJMessageID();
    };
    return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
};