import RefreshToken from "./models/refreshToken.model.js";

export default function handler(req, res) {
    RefreshToken.removeExpiredToken()
    res.status(200).end('Tache de rafraîchissement des tokens exécutée avec succès !');
}