import { getSameChannel } from '../utils/getSameOrOtherChannel.js';
import { getloop, setloop } from '../commands/music/utils/list.js';
import { sendMessageByChannelAndAutoDelete } from '../utils/sendMessage.js';

export const loopmusic = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

    const button = await interaction.channel.messages.fetch(interaction.message.id);

    if (player.hasPlayer()) {
        if (getloop()) {
            setloop(false);

            button.components[0].components[1].data.style = 4
            interaction.update({
                components: interaction.message.components
            });

            return sendMessageByChannelAndAutoDelete(interaction.channel.id, 'Loop: **Off**', 5000);
        } else {
            setloop(true);

            button.components[0].components[1].data.style = 3
            interaction.update({
                components: interaction.message.components
            });

            return sendMessageByChannelAndAutoDelete(interaction.channel.id, 'Loop: **ON**', 5000);
        };
    };
    return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
};