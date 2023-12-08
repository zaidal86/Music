import { getSameChannel } from '../utils/getSameOrOtherChannel.js';
import { sendMessageByChannelAndAutoDelete } from '../utils/sendMessage.js';

export const playpausemusic = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

    const button = await interaction.channel.messages.fetch(interaction.message.id);

    if (player.hasPlayer()) {
        if (player.isPaused()) {
            player.setPaused(false);

            button.components[0].components[2].data.style = 3
            interaction.update({
                components: interaction.message.components
            });

            return sendMessageByChannelAndAutoDelete(interaction.channel.id, '**Musique mise en lecture !**', 5000);
        } else {
            player.setPaused(true);

            button.components[0].components[2].data.style = 4
            interaction.update({
                components: interaction.message.components
            });

            return sendMessageByChannelAndAutoDelete(interaction.channel.id, '**Musique mise en pause !**', 5000);
        };
    };
    return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
};