import { getSameChannel } from '../utils/getSameOrOtherChannel.js';
import yasha from 'yasha';
import { getLastIndice, getQueue, getRandom, removeFromQueue, setLastIndice } from '../commands/music/utils/list.js';
import sleep from '../utils/sleep.js';
import { getDJMessageID } from './utils/getDJMessageID.js';

export const skipmusic = async (interaction, player) => {
    if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
    if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

    if (player.hasPlayer()) {
        player.stop();

        removeFromQueue(getLastIndice());

        if (getQueue().length > 0) {
            const indice = Math.floor(Math.random() * getQueue().length);
            setLastIndice(getRandom() ? indice : 0);

            const track = await yasha.Source.resolve(getQueue()[getRandom() ? indice : 0].link);
            player.play(track);
            player.start();
            interaction.reply(`Now playing **${getQueue()[getRandom() ? indice : 0].title}**`);
            await sleep(5000);
            return interaction.deleteReply();
        } else {
            player.cleanup();
            player.destroy();
            yasha.VoiceConnection.disconnect(interaction.guild);
            interaction.reply(`Music skipped ! le bot quitte le channel il y a plus de musique dans la Queue !`);
            await sleep(5000);
            interaction.deleteReply();

            return await getDJMessageID();
        };
    };
    return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
};