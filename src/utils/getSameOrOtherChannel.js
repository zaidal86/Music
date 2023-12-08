import { client } from '../main.js';

export const getSameChannel = (interaction) => {
  const guild = client.guilds.cache.get(interaction.member.voice.channel?.guildId);
  const botVoiceChannel = guild?.members.me.guild?.voice_connection;
  if (botVoiceChannel && botVoiceChannel.joinConfig.channelId === interaction.member.voice.channel.id) {
    return true
  } else {
    return false
  };
};

export const getOtherChannel = (interaction) => {
  const guild = client.guilds.cache.get(interaction.member.voice.channel.guildId);
  const botVoiceChannel = guild.members.me.guild?.voice_connection;
  if (botVoiceChannel && botVoiceChannel.joinConfig.channelId !== interaction.member.voice.channel.id) {
    return true
  } else {
    return false
  };
};