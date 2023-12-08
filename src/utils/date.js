export const dateString = () => {
    var m = new Date();
    return m.getUTCFullYear() + "/" + (m.getUTCMonth() + 1) + "/" + m.getUTCDate() + " " + (m.getUTCHours() + 1) + ":" + m.getUTCMinutes();
};