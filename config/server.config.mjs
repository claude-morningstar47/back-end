// server.config.js
import { _config as globalConfig } from "./global.config.js";

export const serverConfig = {
    port: globalConfig.port_number,
    corsOptions: {
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
        allowedHeaders: "Content-Type, x-refresh-token, x-access-token",
        origin: [
            //"http://localhost:3000",
            "https://frent-end.vercel.app",
        ],
    },
    limiter: {
        windowMs: globalConfig.windowMs,
        max: 15,
        message: "Too many login attempts, please try again later.",
    },
    sessionOptions: {
        secret: globalConfig.cookie_secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            httpOnly: true,
            // maxAge: _config.cookie_max_age,
            maxAge: 360000,
        },
    }
};


