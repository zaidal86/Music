import { createCanvas, loadImage } from 'canvas';
import { getQueue } from '../commands/music/utils/list.js';
import { parseDuration } from '../utils/parseDuration.js';
import fs from 'fs';

export function createCanvasNowPlaying(currentTimer, timer, img, title, pourcent) {
    const canvasWidth = 800;
    const canvasHeight = 300;
    const rectangleColor = 'rgb(24,24,24)';

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    function drawRectangle(color, width, height) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
    }

    function drawRoundedImage(image, x, y, width, height) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(image, x, y, width, height);
        ctx.restore();
    }

    function drawProgressBar(x, y, width, height, mark00, mark500, markTextSize) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = 'white';
        ctx.font = `${markTextSize}px Arial`;

        ctx.fillText(mark00, x, y + height + markTextSize);
        ctx.fillText(mark500, x + width - ctx.measureText(mark500).width, y + height + markTextSize);
    }

    function drawPercentageBar(x, y, width, height, percentage, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * (percentage / 100), height);
    }

    function drawText(text, color, x, y, fontSize, align) {
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(text, x, y);
    }

    drawRectangle(rectangleColor, canvasWidth, canvasHeight);

    loadImage(img).then((image) => {
        const originalImageWidth = image.width;
        const originalImageHeight = image.height;
        const newImageWidth = originalImageWidth > 200 ? originalImageWidth / 2.5 : originalImageWidth / 1.5;
        const newImageHeight = originalImageHeight < 200 ? originalImageHeight / 1 : originalImageHeight / 1.5;

        const imageX = canvasWidth - 150;
        const imageY = originalImageHeight < 200 ? 43 : 65;

        drawRoundedImage(image, imageX, imageY, newImageWidth, newImageHeight);

        const progressBarHeight = 15;
        const progressBarWidth = 600;
        const progressBarX = 25;
        const progressBarY = 120;

        drawProgressBar(progressBarX, progressBarY, progressBarWidth, progressBarHeight, currentTimer, timer, 14);

        const percentageBarHeight = 15;
        const percentageBarWidth = progressBarWidth;
        const percentageBarX = progressBarX;
        const percentageBarY = progressBarY;
        const percentageBarColor = 'rgb(128,0,128)';

        drawPercentageBar(percentageBarX, percentageBarY, percentageBarWidth, percentageBarHeight, pourcent, percentageBarColor);

        drawText(title, 'white', canvasWidth / 2, canvasHeight - 260, 18, 'center');
        if (getQueue().length < 1) {
            drawText('No other music in queue !', 'white', 130, canvasHeight - 125, 16, 'center');
        } else {
            drawText('Next Music: ', 'white', 75, canvasHeight - 125, 16, 'center');
            let height = 100;
            const maxIterations = Math.min(5, getQueue().length);
            for (let index = 1; index < maxIterations; index++) {
                drawText(`${index}. ${getQueue()[index].title} / ${parseDuration(getQueue()[index].duration)} Minute`, 'white', 45, canvasHeight - height, 16, 'left');
                height = height - 20;
            };
        };

        const out = fs.createWriteStream('./src/assets/nowPlaying.png');
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log('Le canvas a été enregistré.'));
    });
}