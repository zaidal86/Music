import yasha from 'yasha';
import { addToQueue } from '../commands/music/utils/list.js';
import { parseDuration } from '../utils/parseDuration.js';
import sleep from '../utils/sleep.js';

export const modallink = async (interaction, player) => {
    if (player.hasPlayer()) {
        const pattern = /https:\/\/.*\.com/g;
        const matches = interaction.fields.getTextInputValue('link').match(pattern);
        if (!matches) return interaction.reply("Votre lien n'est pas valide !");

        const track = await yasha.Source.resolve(interaction.fields.getTextInputValue('link'));
        if (!(track instanceof yasha.Track)) return interaction.reply("La musique existe pas !");

        addToQueue({
            title: track.title,
            author: track.author,
            link: interaction.fields.getTextInputValue('link'),
            duration: track.duration,
            thumbnails: track.thumbnails[3] ? track.thumbnails[3].url : track.thumbnails[0].url
        });

        interaction.reply(`Vous venez d'ajouter **${track.title}** / **${parseDuration(track.duration)}** dans la queue !`);
        await sleep(5000);

        return interaction.deleteReply();
    };
    return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
};