import mongoose from "mongoose";
import { db } from "../models/index.js";

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopogy: true,
  });
};
// Connexion à la base de données MongoDB
const Role = db.role;
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

export { connectDB, initial };
