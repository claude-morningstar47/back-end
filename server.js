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

const app = express();

app.use(session(serverConfig.sessionOptions));
app.use(cors(serverConfig.corsOptions));
app.use(cookieParser());


// ... Autres configurations
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const faviconPath = path.join(__dirname, "appointment.png")

app.use(favicon(faviconPath))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);


// Gestionnaire d'erreurs pour les erreurs internes du serveur (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// set port, listern for requests

app.listen(serverConfig.port, () => {
  console.log(`Server is running on port ${serverConfig.port}.`);
});

// Connexion à la base de données MongoDB
const Role = db.role;

db.mongoose
  .connect(_config.mongo_url)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection", err);
    process.exit(1);
  });

// Initialisation des rôles dans la base de données
async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await new Role({ name: "user" }).save();
      await new Role({ name: "moderator" }).save();
      await new Role({ name: "admin" }).save();
      console.log("Roles added to the collection .");
    }
  } catch (err) {
    console.error("Error initializing roles", err);
  }
}
