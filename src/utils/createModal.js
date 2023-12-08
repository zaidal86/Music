import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const createModal = (textBuild = { label, style, customId }, modalBuild = { title, customId }) => {

    const TextInput = new TextInputBuilder({
        label: textBuild.label,
        style: TextInputStyle[textBuild.style] || TextInputStyle.Short,
        customId: textBuild.customId
    })

    const modal = new ModalBuilder({
        title: modalBuild.title,
        customId: modalBuild.customId
    })

    const createModal = modal.addComponents(new ActionRowBuilder().addComponents(TextInput))

    return createModal;
};