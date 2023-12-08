import { musicData } from '../../models/musicData.js';
import mongoose from 'mongoose';
import { client } from '../../main.js';

export const getDJMessageID = async () => {
    const DJTurntableID = mongoose.model('musicData', musicData);
    try {
        const data = await DJTurntableID.find({});

        await client.channels.fetch(process.env.CHANNELID).then(async channel => {
            const message = await channel.messages.fetch();

            if (message.has(data[0].DJTurntableID)) {
                return channel.messages.delete(data[0].DJTurntableID);
            };
            return;
        });

    } catch (error) {
        console.log(error);
    };
};