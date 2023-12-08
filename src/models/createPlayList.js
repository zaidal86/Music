import mongoose from 'mongoose';

export const createPlayListModel = new mongoose.Schema({
    title: {
        type: String,
    },
    date: {
        type: String
    },
    songs: []
});