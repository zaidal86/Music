import { getSameChannel } from '../../utils/getSameOrOtherChannel.js';
import sleep from '../../utils/sleep.js';
import { musicData } from '../../models/musicData.js';
import mongoose from 'mongoose';

export const volume = {
    data: {
        name: 'volume',
        description: 'Volume for your music !',
        options: [{
            type: 4,
            name: 'volume',
            description: 'Enter between 0 and 100',
            required: true,
            min_value: 0,
            max_value: 100,
        }],
    },
    async execute(interaction, player) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal
        if (!getSameChannel(interaction)) return interaction.reply({ content: 'Le bot est pas dans votre channel !', ephemeral: true }); // verification si l'utilisateur est dans le meme salon que le bot

        if (player.hasPlayer()) {
            const DJTurntableID = mongoose.model('musicData', musicData);
            try {
                const data = await DJTurntableID.find({});

                data[0].volume = (interaction.options.get('volume').value / 100);
                await data[0].save()

                player.setVolume(parseFloat(data[0].volume));
                interaction.reply(`Le volume de la musique a été défini sur ${interaction.options.get('volume').value} %`);
                await sleep(5000);
                return interaction.deleteReply();

            } catch (error) {
                console.log(error);
            };
        };
        return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande !', ephemeral: true });
    },
};