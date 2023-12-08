import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const createButton = (label, customId, style, disabled, emoji, url) => {

    const newButton = new ButtonBuilder({
        style: ButtonStyle[style] || ButtonStyle.Primary,
        disabled: disabled || false,
        label: label,
        customId: customId || '',
        setEmoji: emoji || '',
        url: url || ''
    })

    return newButton;
}