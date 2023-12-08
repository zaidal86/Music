import { ActionRowBuilder } from 'discord.js';
import { createButton } from '../../utils/createButton.js';
import { musicData } from '../../models/musicData.js';
import mongoose from 'mongoose';
import { getloop, getRandom } from './utils/list.js'

export const button = {
    data: {
        name: 'button',
        type: 1,
        description: 'Cree les boutons de la platine de DJ',
    },
    async execute(interaction) {
        const add = await createButton('🎵 AddMusic', 'addmusic', 'Success')
        const playList = await createButton('📀 PlayList', 'playlist', 'Success')
        const nowPlaying = await createButton('🎼 NowPlaying', 'nowplaying', 'Success')
        const pauseResume = await createButton('⏯️ PlayPause', 'playpausemusic', 'Success')
        const skip = await createButton('⏩ Skip', 'skipmusic')
        const loop = await createButton('🔂 Loop', 'loopmusic', getloop() ? 'Success' : 'Danger')
        const random = await createButton('🔀 Random', 'randommusic', getRandom() ? 'Success' : 'Danger')
        const leave = await createButton('🔗 Leave', 'leavemusic', 'Danger')
        const volumeP = await createButton('🔊 Volume', 'volumeP', 'Secondary')
        const volumeM = await createButton('🔈 Volume', 'volumeM', 'Secondary')

        const firstRow = new ActionRowBuilder().addComponents(random, loop, pauseResume, skip, nowPlaying)
        const secondRow = new ActionRowBuilder().addComponents(add, volumeM, volumeP, playList, leave)

        const hyuhuhu = await interaction.reply({ content: 'Voici les platines de **DJ** 😎', components: [firstRow, secondRow], fetchReply: true });
        const PanelID = hyuhuhu.id;
        console.log(PanelID)

        const DJTurntableID = mongoose.model('musicData', musicData);
        try {
            const data = await DJTurntableID.find({});
            if (data.length > 0) {
                data[0].DJTurntableID = PanelID;
                data[0].save();

            } else {
                const newPlaylist = new DJTurntableID({
                    DJTurntableID: PanelID,
                    volume: 100
                });

                await newPlaylist.save();
            };
        } catch (error) {
            console.log(error);
        };
    }
};