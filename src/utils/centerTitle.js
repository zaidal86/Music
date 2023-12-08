export const centerTitle = (title) => {
    const progressBarLength = 40;
    let centeredTitle;
    if (title.length >= progressBarLength) {
        centeredTitle = title.substring(0, progressBarLength);
    } else {
        const titlePadding = Math.floor((progressBarLength - title.length) / 2);
        centeredTitle = ' '.repeat(titlePadding) + title + ' '.repeat(progressBarLength - titlePadding - title.length);
    }
    return centeredTitle;
};