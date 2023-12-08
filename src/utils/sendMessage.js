import { client } from '../main.js';

export const sendMessageByChannelAndAutoDelete = (ChannelID, Message, Timeout) => {
    client.channels.cache.get(ChannelID).send(Message).then((message) => setTimeout(() => message.delete(), Timeout));
};
