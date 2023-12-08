import { parseDuration } from '../../utils/parseDuration.js';
import { getQueue } from './utils/list.js';
import { createCanvasNowPlaying } from '../../utils/createCanvasNowPlaying.js';
import sleep from '../../utils/sleep.js';
import { getSameChannel } from '../../utils/getSameOrOtherChannel.js';

export const nowplaying = {
    data: {
        name: 'nowplaying',
        description: 'Montre la musique que le bot joue actuellement !',
    },
    async execute(interaction, player) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
        if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot\

        if (player.hasPlayer()) {
            createCanvasNowPlaying(parseDuration(player.getTime()), parseDuration(player.getDuration()), getQueue()[0].thumbnails, getQueue()[0].title, (player.getTime() / player.getDuration() * 100), getQueue()[0].width, getQueue()[0].height)
            await sleep(200);

            interaction.reply({ files: ["./src/assets/nowPlaying.png"] });
            await sleep(5000);
            return interaction.deleteReply();
        };
        return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
    },
};