import { parseDuration } from '../../utils/parseDuration.js';
import { EmbedBuilder } from 'discord.js';
import { getQueue } from './utils/list.js';
import { getSameChannel } from '../../utils/getSameOrOtherChannel.js';
import sleep from '../../utils/sleep.js';

export const queue = {
    data: {
        name: 'queue',
        description: 'get music in queue !',
    },
    async execute(interaction, player) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
        if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

        if (getQueue().length > 0) {
            const songStrings = [];
            for (let i = 1; i < Math.min(getQueue().length, 20); i++) {
                const song = getQueue()[i];
                songStrings.push(`**${i}.** [${song.title}](${song.link}) \`[${parseDuration(song.duration)}]\` \n`);
            }
            const str = songStrings.join('');
            const queueList = new EmbedBuilder()
                .setAuthor({ name: 'Voici la liste des musiques !' })
                .setColor('#1ABC9C')
                .setDescription(`**Now playing**: [${getQueue()[0].title}](${getQueue()[0].link}}) \`[${parseDuration(getQueue()[0].duration)}]\` \n ${songStrings[0] ? str : '**No more sound !**'}`)
                .setTimestamp();
            interaction.reply({ embeds: [queueList] });
            await sleep(5000)
            return interaction.deleteReply();
        };
        return interaction.reply({ content: "Il n'y a pas de musique dans la queue", ephemeral: true });
    },
};