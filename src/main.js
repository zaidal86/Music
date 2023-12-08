import dotenv from 'dotenv';
dotenv.config();
import { getQueue, removeFromQueue, getloop, getRandom, getLastIndice, setLastIndice } from "./commands/music/utils/list.js";
import { Client, GatewayIntentBits } from 'discord.js';
import * as commands from './commands/other/index.js';
import * as music from './commands/music/index.js';
import * as buttons from './buttons/index.js';
import * as modals from './modals/index.js';
import * as color from './utils/color.js';
import * as selector from './selector/index.js';
import mongoose from 'mongoose';
import yasha from 'yasha';
import { getDJMessageID } from './buttons/utils/getDJMessageID.js';
import { sendMessageByChannelAndAutoDelete } from './utils/sendMessage.js'

mongoose.set('strictQuery', true);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates],
});

// console.log(process.env.BOT_TOKEN)


client.login(process.env.BOT_TOKEN);

client.on('ready', async () => {
    console.log(color.green('discord bot Ready !'))
    mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
            console.log(color.green('Connexion à MongoDB établie.'));

            const allCommands = [...Object.values(commands).map(command => command.data), ...Object.values(music).map(music => music.data)];

            try {
                console.log('Registering commands...');
                await client.application.commands.set(allCommands);
                console.log('All commands registered successfully.');

            } catch (error) {
                console.error('Error while registering commands:', error);
            }

        })
        .catch((error) => {
            throw new Error(`Erreur de connexion à MongoDB : ${error}`)
        });
});

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;

    console.log(`${color.yellow('[LOGS]')} there was a message from ${color.red(msg.author.username)} on the ${color.green(msg.channel.id)} channel : ${msg.content}!`);

    if (!msg.content.startsWith('!')) return
    const commandName = msg.content.slice(1);

    // console.log(`Nom de la commande de l'utilisateur: ${commandName}`) // LOGS
    if (commandName === 'rota' || commandName === 'pof' || commandName === 'auto' || commandName === 'plouf') {
        for (const key in commands) {
            // console.log(`Key: ${key}`); // LOGS
            if (key === commandName) return client.channels.cache.get(msg.channel.id).send(await commands[key].execute());
        };
    };
});

const player = new yasha.TrackPlayer({ normalize_volume: true }); // Creation d'un player bot

player.on('finish', async () => {
    if (getloop() === false) {
        removeFromQueue(getLastIndice());
        if (getQueue().length > 0) {
            const indice = Math.floor(Math.random() * getQueue().length);
            setLastIndice(getRandom() ? indice : 0)
            const track = await yasha.Source.resolve(getQueue()[getRandom() ? indice : 0].link);
            player.play(track)
            player.start();
            sendMessageByChannelAndAutoDelete(process.env.CHANNELID, `Now playing **${getQueue()[getRandom() ? indice : 0].title}**`, 5000)
        } else {
            player.cleanup()
            player.destroy()
            yasha.VoiceConnection.disconnect(client.guilds.cache.get(process.env.DISCORD_ID));
            sendMessageByChannelAndAutoDelete(process.env.CHANNELID, `Le bot quitte le channel il y a plus de musique dans la Queue !`, 5000)

            return await getDJMessageID();
        };
    } else {
        const track = await yasha.Source.resolve(getQueue()[0].link);
        player.play(track)
        player.start();
    };
});

client.on('interactionCreate', async (interaction) => {
    // console.log(interaction.type)
    // console.log(interaction.customId)
    // console.log(interaction)

    for (const key in commands) {
        // console.log(`Key: ${key}`); // LOGS
        if (key === interaction.commandName) return interaction.reply(await commands[key].execute(interaction, player));
    };

    for (const key in music) {
        // console.log(`Key: ${key}`); // LOGS
        if (key === interaction.commandName) return music[key].execute(interaction, player);
    };

    for (const key in buttons) {
        // console.log(`Key: ${key}`); // LOGS
        if (key === interaction.customId) return buttons[key](interaction, player);
    };

    for (const key in modals) {
        // console.log(`Key: ${key}`); // LOGS
        if (key === interaction.customId) return modals[key](interaction, player);
    };

    for (const key in selector) {
        // console.log(`Key: ${key}`); // LOGS
        if (key === interaction.customId) return selector[key](interaction, player);
    };
});

export { client };