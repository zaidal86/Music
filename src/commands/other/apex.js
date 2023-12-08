import axios from 'axios';

export const currentPubMap = {
    data: {
        name: 'rota',
        type: 1,
        description: 'Map actuelle en pub sur Apex Legends',
    },
    async execute() {
        const url = `https://api.mozambiquehe.re/maprotation?version=5&auth=${process.env.APEX_TOKEN}`;

        const response = await axios.get(url);
        const data = response.data;

        const pubMap = `C'est ${data.battle_royale.current.map} pendant encore ${data.battle_royale.current.remainingTimer}`;

        return pubMap;
    }
};