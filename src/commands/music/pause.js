import { getSameChannel } from '../../utils/getSameOrOtherChannel.js';
import sleep from '../../utils/sleep.js';

export const pause = {
    data: {
        name: 'pause',
        description: 'Pause your music !',
    },
    async execute(interaction, player) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
        if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

        if (player.hasPlayer()) {
            if (player.isPaused()) return interaction.reply({ content: 'Le bot est déjà en pause !', ephemeral: true });
            player.setPaused(true);
            interaction.reply(`Le bot a été mis en pause !`);
            await sleep(5000)
            return interaction.deleteReply();
        };
        return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
    },
};