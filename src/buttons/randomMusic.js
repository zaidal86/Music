import { getSameChannel } from '../utils/getSameOrOtherChannel.js';
import { sendMessageByChannelAndAutoDelete } from '../utils/sendMessage.js';
import { getRandom, setRandom } from '../commands/music/utils/list.js';

export const randommusic = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

    const button = await interaction.channel.messages.fetch(interaction.message.id);

    if (player.hasPlayer()) {
        if (getRandom()) {

            setRandom(false)

            button.components[0].components[0].data.style = 4
            interaction.update({
                components: interaction.message.components
            });

            return sendMessageByChannelAndAutoDelete(interaction.channel.id, 'Mode random desactiver !', 5000);
        } else {
            setRandom(true)

            button.components[0].components[0].data.style = 3
            interaction.update({
                components: interaction.message.components
            });

            return sendMessageByChannelAndAutoDelete(interaction.channel.id, 'Mode random activer !', 5000);
        }
    };
    return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
};