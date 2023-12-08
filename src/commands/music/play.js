import { createPlayListModel } from '../../models/createPlayList.js';
import { addToQueue, getQueue } from './utils/list.js';
import mongoose from 'mongoose';
import yasha from 'yasha';
import { getOtherChannel, getSameChannel } from '../../utils/getSameOrOtherChannel.js';
import sleep from '../../utils/sleep.js';

const addMusicToQueue = (track, interaction) => {
    addToQueue({
        title: track.title,
        author: track.author,
        link: interaction.options.get('link').value,
        duration: track.duration,
        thumbnails: track.thumbnails[3] ? track.thumbnails[3].url : track.thumbnails[0].url
    });
};

export const play = {
    data: {
        name: 'play',
        description: 'Play your music !',
        options: [{
            type: 3,
            name: 'link',
            description: 'Enter the name of your music',
            required: false,
        },
        {
            type: 3,
            name: 'name-playlist',
            description: 'Enter the name of your playlist',
            required: false
        }],
    },
    async execute(interaction, player) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'Vous devez etre dans un salon vocal !', ephemeral: true }); // Verification si l'utilisateur est dans un salon vocal

        const link = interaction.options.get('link')?.value;
        const nameplaylist = interaction.options.get('name-playlist')?.value;

        if ((!link && !nameplaylist) || (link && nameplaylist)) { // verification si l'utilisateur a saisie au moins un champ et pas deux
            if (!link && !nameplaylist) {
                return interaction.reply({ content: 'Veuillez fournir au moins une option valide.', ephemeral: true });
            } else {
                return interaction.reply({ content: 'Veuillez choisir soit l\'option 1 ou l\'option 2, mais pas les deux.', ephemeral: true });
            }
        };

        if (getOtherChannel(interaction)) return interaction.reply({ content: 'Le bot est deja dans un salon vocal !', ephemeral: true });

        if (nameplaylist) { // Partie playList

            try {
                const Playlist = mongoose.model(interaction.user.id, createPlayListModel); // on cherche l'utilisateur dans la base de donnes
                const title = nameplaylist.toLowerCase(); // on return la playlist de l'utilisateur sans majuscule
                const data = await Playlist.findOne({ title: title }); // on recherche si l'utilisateur a cette playlist
                if (data) {
                    if (data.songs.length === 0) return interaction.reply({ content: `Aucune musique existe dans cette playlist !`, ephemeral: true });

                    if (getSameChannel(interaction)) { // verification si le bot est connecter dans le meme salon que l'utilisateur
                        if (player.hasPlayer()) { // si le bot a est connecter et a aussi une musique
                            for (let i = 0; i < data.songs.length; i++) {
                                addToQueue(data.songs[i]);
                            };
                            interaction.reply('La playlist a ete ajouter a la queue');
                            await sleep(5000)
                            return interaction.deleteReply();
                        }

                    } else { // Si le bot est pas connecter dans le meme salon

                        for (let i = 0; i < data.songs.length; i++) {
                            addToQueue(data.songs[i]);
                        };

                        const track = await yasha.Source.resolve(getQueue()[0].link); // recuperation des donnees de la musique
                        if (interaction.member.voice.channel.full) return interaction.reply('Le salon est full !');
                        const connection = await yasha.VoiceConnection.connect(interaction.member.voice.channel) // Connexion du bot au channel vocal
                        connection.subscribe(player); // on ajoute le lecteur musique au bot
                        player.play(track); // on ajoute la musique dans le bot
                        player.start(); // on lance la musique
                        interaction.reply('Now playing: **' + track.title + '**');
                        await sleep(5000)
                        return interaction.deleteReply();
                    }
                } else {
                    return interaction.reply({ content: `Aucune playlist portant le titre **${title}** n'a été trouvée.`, ephemeral: true });
                };
            } catch (error) {
                console.log(error)
                return interaction.reply({ content: 'ERREUR 500', ephemeral: true });
            };
        };

        if (link) {  // Partie link

            const pattern = /https:\/\/.*\.com/g; // Regex de verification d'un lien internet
            const matches = interaction.options.get('link').value.match(pattern); // verification du lien youtube, soundcloud
            if (!matches) return interaction.reply({ content: 'Votre lien de correspond pas !', ephemeral: true }); // si le string est pas un lien return erreur

            try {
                const track = await yasha.Source.resolve(interaction.options.get('link').value); // recuperation des donnees de la musique
                if (!(track instanceof yasha.Track)) return interaction.reply({ content: 'La musique existe pas !', ephemeral: true }); // verifie si la musique existe

                if (!getSameChannel(interaction)) { // verification si le bot est connecter dans le meme salon que l'utilisateur
                    if (interaction.member.voice.channel.full) return interaction.reply('Le salon est full !');
                    const connection = await yasha.VoiceConnection.connect(interaction.member.voice.channel) // Connexion du bot au channel vocal
                    connection.subscribe(player); // on ajoute le lecteur musique au bot
                }

                if (getQueue().length > 0) {
                    addMusicToQueue(track, interaction);
                    interaction.reply(`Add playlist: **${track.title}**`);
                    await sleep(5000)
                    return interaction.deleteReply();
                } else {
                    player.play(track); // on ajoute la musique dans le bot
                    player.start(); // on lance la musique
                    addMusicToQueue(track, interaction);
                    interaction.reply(`Now playing: **${track.title}**`);
                    await sleep(5000)
                    return interaction.deleteReply();
                };
            } catch (error) {
                console.log(error)
                return interaction.reply({ content: 'ERREUR 500', ephemeral: true });
            };
        };
    }
};