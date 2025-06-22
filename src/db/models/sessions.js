import { model } from "mongoose";
import { Schema } from "mongoose";

const sessionsSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: false,
    },
    refreshToken: {
        type: String,
        required: true
    },
    accessTokenValidUntil: {
        type: Date,
        required: true
    },
    refreshTokenValidUntil: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    });

export const SessionsCollection = model('sessions', sessionsSchema);