const emojis = {
    progress1: "<:1:1138658242629738566>",
    progress2: "<:2:1138658270379253770>",
    progress3: "<:3:1138658272958746714>",
    progress4: "<:4:1138658275630514217>",
    progress5: "<:5:1138658274359640094>",
    progress6: "<:6:1138658277408911390>",
    progress7: "<:7:1138658278453280829>",
    progress8: "<:8:1138658280240054323>",
}

export const progressBar = (player) => {
    const percentage = player.getTime() / player.getDuration();
    const part = Math.floor((player.getTime() / player.getDuration()) * 13);
    return `${percentage < 0.05 ? emojis.progress7 : emojis.progress1}${emojis.progress2.repeat(part)}${percentage < 0.05 ? '' : emojis.progress3}${emojis.progress5.repeat(12 - part)}${emojis.progress6}`
};