import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { _config } from "./config/global.config.js";
import welcomeMessage from "./config/welcomeMessage.js";
import csurf from "csurf";
import cron from "node-cron";
import RefreshToken from "./models/refreshToken.model.js";

const app = express();
dotenv.config();

// Configuration CORS
var corsOptions = {
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: "Content-Type, x-refresh-token, x-access-token",
  origin: [
    "http://localhost:3000",
    "http://192.168.100.2:3000",
    "http://192.168.100.5:3000",
    "http://192.168.100.6:3000",
    "http://192.168.100.7:3000",
    "http://192.168.100.8:3000",
    "http://192.168.100.9:3000",
    "http://192.168.100.12:3000",
    "http://192.168.100.13:3000",
    "http://192.168.100.14:3000",
    "http://192.168.100.15:3000",
    "http://192.168.100.16:3000",
    "http://192.168.100.22:3000",
    "http://192.168.100.24:3000",
    "http://192.168.100.50:3000",
  ],
};

app.use(cookieParser());
app.use(
  session({
    secret: _config.cookie_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Utilisez "true" si vous utilisez HTTPS
      httpOnly: true,
      maxAge: 3600000,
    },
  })
);

const minuites = 2; // Bloquer les tentatives de connexion pendant 2 minutes
const windowMs = minuites * 60 * 1000;

const limiter = rateLimit({
  windowMs: windowMs,
  max: 5, // Autoriser seulement 5 tentatives de connexion par fenêtre
  message: "Too many login attempts, please try again later.",
});

// Planifie l'exécution de la suppression tous les jours à minuit
// const RefreshToken = db.role;

cron.schedule("*/5 * * * *", async () => {
  await RefreshToken.removeExpiredTokens();
  console.log("Tâche de rafraîchissement des tokens exécutée avec succès !");
});

// const csrfProtection = csurf({ cookie: true });

// app.use(csrfProtection);
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get("/", (req, res) => {
  res.send(welcomeMessage);
});

app.use("/api/auth/", limiter, authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/appointments/", appointmentRoutes);

// Gestionnaire d'erreurs pour les routes non trouvées (404)
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Gestionnaire d'erreurs pour les erreurs internes du serveur (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// set port, listern for requests
const PORT = _config.port_number;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
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
