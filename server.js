import fs from "fs";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import express from "express";
import winston from "winston";
import favicon from "serve-favicon";
import { fileURLToPath } from "url";
import session from "express-session";
import { db } from "./models/index.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import { initial } from "./config/db.config.js";
import { serverConfig } from "./config/server.config.mjs";
import { removeExpiredRefreshTokens } from "./background.js";
import { _config } from "./config/global.config.js";

const app = express();
let logger;

if (serverConfig.environment !== "production") {
  // Configuration des répertoires et fichiers de journal
  const logDirectory = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "logs"
  );
  const logFilePath = path.join(logDirectory, "access.log");
  const errFilePath = path.join(logDirectory, "error.log");

  // Vérification et création du répertoire des journaux
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  // Adaptateur pour le flux de Winston
  class WinstonStreamAdapter {
    write(message) {
      logger.info(message);
    }
  }

  //Configuration du logger Winston
  logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: errFilePath, level: "error" }),
      new winston.transports.File({ filename: logFilePath, level: "info" }),
    ],
  });

  // Utilisation du logger Winston avec Morgan pour la journalisation des requêtes
  app.use(morgan("combined", { stream: new WinstonStreamAdapter() }));

  // Utilisation de setTimeout pour déclencher removeExpiredRefreshTokens après 20 secondes
  setTimeout(() => {
    removeExpiredRefreshTokens();
  }, 20000);
} else {
  app.use(morgan("dev"));
}
// Configuration des middlewares
app.use(session(serverConfig.sessionOptions));
app.use(cors(serverConfig.corsOptions));
app.use(cookieParser());

// Configuration du favicon
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const faviconPath = path.join(__dirname, "appointment.png");
app.use(favicon(faviconPath));

// Configuration du body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des routes
app.use("/", router);

// Gestionnaire d'erreurs pour les erreurs internes du serveur (500)
app.use((err, req, res, next) => {
  logger.error(err.stack);
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Démarrage du serveur
app.listen(serverConfig.port, () => {
  console.log(`Server is running on port ${serverConfig.port}.`);
});

// Fonction pour la connexion à la base de données et initialisation
async function connectToDb() {
  try {
    // await db.mongoose.connect(serverConfig.mongodb_connect);
    await db.mongoose.connect(_config.mongo_url);
    console.log("Successfully connected to MongoDB.");
    await initial();
  } catch (error) {
    logger.error("Connection", error);
    console.error("Connection", error);
    process.exit(1);
  }
}

// Appel de la fonction de connexion à la base de données
connectToDb();
