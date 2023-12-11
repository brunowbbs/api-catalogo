"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    firebaseConfig: {
        apiKey: process.env.API_KEY_FIREBASE,
        authDomain: process.env.AUTH_DOMANIN_FIREBASE,
        projectId: process.env.PROJECT_ID_FIREBASE,
        storageBucket: process.env.STORAGE_BUCKET_FIREBASE,
        messagingSenderId: process.env.MESSAGING_SENDER_ID_FIREBASE,
        appId: process.env.APP_ID_FIREBASE,
    },
};
