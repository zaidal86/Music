import { setloop } from './utils/list.js';
import { getSameChannel } from '../../utils/getSameOrOtherChannel.js';
import sleep from '../../utils/sleep.js';

export const loop = {
    data: {
        name: 'loop',
        description: 'Loop your music !',
        options: [{
            type: 5,
            name: 'boolean',
            description: 'Enter true or false',
            required: true,
        }],
    },
    async execute(interaction, player) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
        if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

        if (player.hasPlayer()) {
            if (interaction.options.get('boolean').value) {
                setloop(interaction.options.get('boolean').value);
                interaction.reply(`Mode loop activé !`);
                await sleep(5000)
                return interaction.deleteReply();
            } else {
                setloop(interaction.options.get('boolean').value);
                interaction.reply(`Mode loop désactiver !`);
                await sleep(5000)
                return interaction.deleteReply();
            }
        };
        return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
    },
};