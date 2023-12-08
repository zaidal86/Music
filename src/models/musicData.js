import mongoose from 'mongoose';

export const musicData = new mongoose.Schema({
    DJTurntableID: {
        type: String
    },
    volume: {
        type: String
    }
});