import { createModal } from '../utils/createModal.js';
import { getSameChannel } from '../utils/getSameOrOtherChannel.js';

export const addmusic = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

    if (player.hasPlayer()) {
        const modal = createModal({ customId: 'link', label: 'Paste your link here !' }, { customId: 'modallink', title: 'Add new music in queue !' })
        return await interaction.showModal(modal);
    };
    return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
};