// background.js
import RefreshToken from "./models/refreshToken.model.js";

async function removeExpiredRefreshTokens() {
  try {
    // Supprimez les refresh tokens expirés
    await RefreshToken.removeExpiredTokens();
    console.log(`Deleted expired refresh tokens.`);
  } catch (err) {
    console.error("Error deleting expired refresh tokens", err);
  }
}
export { removeExpiredRefreshTokens };
