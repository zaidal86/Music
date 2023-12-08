import { musicData } from '../models/musicData.js';
import mongoose from 'mongoose';

const save = async (interaction, volume) => {
    const DJTurntableID = mongoose.model('musicData', musicData);
    try {
        const data = await DJTurntableID.find({});

        if (data.length > 0) {
            data[0].volume = volume;
            data[0].save();
            interaction.reply(`Le volume de la musique a été défini sur ${volume} %`);
            await sleep(5000);
            return interaction.deleteReply();
        } else {
            const newVolume = new DJTurntableID({
                volume: volume,
            });
            await newVolume.save();
            interaction.reply(`Le volume de la musique a été défini sur ${volume} %`);
            await sleep(5000);
            return interaction.deleteReply();
        };

    } catch (error) {
        console.log(error);
        interaction.reply('Il y a eu une erreur !');
        await sleep(5000);
        return interaction.deleteReply();
    };
};