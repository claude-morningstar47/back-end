import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import { fileURLToPath } from "url";
import path from "path";
import { db } from "./models/index.js";
import { _config } from "./config/global.config.js";
import { serverConfig } from "./config/server.config.mjs";
import router from "./routes/index.js";
import winston from 'winston';
import fs from 'fs';

const app = express();

// Configuration des répertoires et fichiers de journal
// const logDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'logs');
// const logFilePath = path.join(logDirectory, 'access.log');
// const errFilePath = path.join(logDirectory, 'error.log');

// Vérification et création du répertoire des journaux
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

// Adaptateur pour le flux de Winston
class WinstonStreamAdapter {
  write(message) {
    logger.info(message);
  }
}

// Configuration du logger Winston
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: errFilePath, level: 'error' }),
//     new winston.transports.File({ filename: logFilePath, level: 'info' }),
//   ],
// });

// Configuration des middlewares
app.use(session(serverConfig.sessionOptions));
app.use(cors(serverConfig.corsOptions));
app.use(cookieParser());

// Configuration du favicon
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const faviconPath = path.join(__dirname, "appointment.png");
app.use(favicon(faviconPath));

// Utilisation du logger Winston avec Morgan pour la journalisation des requêtes
// app.use(morgan("combined", { stream: new WinstonStreamAdapter() }));
app.use(morgan('dev'));

// Configuration du body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des routes
app.use("/", router);

// Gestionnaire d'erreurs pour les erreurs internes du serveur (500)
app.use((err, req, res, next) => {
  // logger.error(err.stack);
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Démarrage du serveur
app.listen(serverConfig.port, () => {
  console.log(`Server is running on port ${serverConfig.port}.`);
});

// Connexion à la base de données MongoDB
const Role = db.role;

// Fonction pour la connexion à la base de données et initialisation
async function connectToDb() {
  try {
    await db.mongoose.connect(_config.mongo_url);
    console.log("Successfully connected to MongoDB.");
    await initial();
  } catch (error) {
    // logger.error("Connection", error);
    console.error("Connection", error);
    process.exit(1);
  }
}

// Appel de la fonction de connexion à la base de données
connectToDb();

// Initialisation des rôles dans la base de données
async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "moderator" }).save(),
        new Role({ name: "admin" }).save(),
      ]);
      console.log("Roles added to the collection.");
    }
  } catch (err) {
    // logger.error("Error initializing roles", err);
    console.error("Error initializing roles", err);
  }
}
