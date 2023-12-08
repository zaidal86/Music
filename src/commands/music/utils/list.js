let queue = [];
let loop = false;
let loopQueue = false;
let random = false;
let indice = 0;

export const addToQueue = (song) => {
    queue.push(song);
}

export const removeFromQueue = (index) => {
    queue.splice(index, 1);
}

export const getQueue = () => {
    return queue;
}

export const removeQueue = () => {
    queue = []
}

export const setloop = (boolean) => {
    loop = boolean;
}

export const setloopQueue = (boolean) => {
    loopQueue = boolean;
}

export const setRandom = (boolean) => {
    random = boolean;
}

export const setLastIndice = (numbre) => {
    indice = numbre;
}

export const getloop = () => {
    return loop;
}

export const getloopQueue = () => {
    return loopQueue;
}

export const getRandom = () => {
    return random;
}

export const getLastIndice = () => {
    return indice;
}