// import express from "express";
// import cors from "cors";
// import path from 'path'
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// import { db } from "./models/index.js";
// import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import appointmentRoutes from "./routes/appointment.routes.js";
// import morgan from "morgan";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// import rateLimit from "express-rate-limit";
// import favicon from 'serve-favicon'
// import { _config } from "./config/global.config.js";
// import welcomeMessage from "./config/welcomeMessage.js";
// import RefreshToken from "./models/refreshToken.model.js";
// import cron from "node-cron";
// import csurf from "csurf";




// const app = express();
// dotenv.config();

// // Configuration CORS
// var corsOptions = {
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   credentials: true,
//   allowedHeaders: "Content-Type, x-refresh-token, x-access-token",

//   origin: [
//     //"http://localhost:3000",
//     "https://frent-end.vercel.app",
//   ],


// };

// app.use(cookieParser());
// app.use(
//   session({
//     secret: _config.cookie_secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true, // Utilisez "true" si vous utilisez HTTPS
//       httpOnly: true,
//       maxAge: 3600000,
//     },
//   })
// );

// const minuites = 2; // Bloquer les tentatives de connexion pendant 2 minutes
// const windowMs = minuites * 60 * 1000;

// const limiter = rateLimit({
//   windowMs: windowMs,
//   max: 15, // Autoriser seulement 5 tentatives de connexion par fenêtre
//   message: "Too many login attempts, please try again later.",
// });

// // Planifie l'exécution de la suppression tous les jours à minuit

// cron.schedule("0 10 * * *", async () => {
//   await RefreshToken.removeExpiredTokens();
//   console.log("Tâche de rafraîchissement des tokens exécutée avec succès !");
// });

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const faviconPath = path.join(__dirname, "appointment.png")
// // const csrfProtection = csurf({ cookie: true });
// // app.use(csrfProtection);
// app.use(favicon(faviconPath))
// app.use(cors(corsOptions));
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // Routes
// app.get("/", (req, res) => {
//   res.send(welcomeMessage);
// });

// app.use("/api/auth/", limiter, authRoutes);
// app.use("/api/users/", userRoutes);
// app.use("/api/appointments/", appointmentRoutes);

// // Gestionnaire d'erreurs pour les routes non trouvées (404)
// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Gestionnaire d'erreurs pour les erreurs internes du serveur (500)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// // set port, listern for requests
// const PORT = _config.port_number;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

// // Connexion à la base de données MongoDB
// const Role = db.role;

// db.mongoose
//   .connect(_config.mongo_url)
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//     initial();
//   })
//   .catch((err) => {
//     console.error("Connection", err);
//     process.exit(1);
//   });

// // Initialisation des rôles dans la base de données
// async function initial() {
//   try {
//     const count = await Role.estimatedDocumentCount();
//     if (count === 0) {
//       await new Role({ name: "user" }).save();
//       await new Role({ name: "moderator" }).save();
//       await new Role({ name: "admin" }).save();
//       console.log("Roles added to the collection .");
//     }
//   } catch (err) {
//     console.error("Error initializing roles", err);
//   }
// }



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

app.use(cors(serverConfig.corsOptions));
app.use(cookieParser());

app.use(
  session({
    secret: _config.cookie_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      // maxAge: _config.cookie_max_age,
      maxAge: 360000,
    },
  })
);

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
