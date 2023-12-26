// background.js
import { db } from "./models/index.js";
import RefreshToken from "./models/refreshToken.model.js";

export default async function removeExpiredRefreshTokens() {
  try {
    // Supprimez les refresh tokens expirés
    const result = await RefreshToken.removeExpiredTokens();
    console.log(`Deleted ${result.deletedCount} expired refresh tokens.`);
  } catch (err) {
    console.error("Error deleting expired refresh tokens", err);
  }
}
