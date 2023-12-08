export const parseDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const formattedMinutes = minutes.toFixed(0).padStart(2, '0'); // Arrondit et ajoute un zéro devant si nécessaire
    return hours + ':' + formattedMinutes;
}