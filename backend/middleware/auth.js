require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log('Authorization Header:', authorizationHeader); // Debug pour vérifier l'en-tête
        
        // Vérifie que l'en-tête Authorization est présent
        if (!authorizationHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // Récupère le token en supprimant le préfixe "Bearer "
        const token = authorizationHeader.split(' ')[1];
        
        // Vérifie et décode le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decodedToken); // Debug pour voir le contenu du token

        // Ajoute l'identifiant utilisateur dans l'objet `req.auth` pour le reste de la requête
        req.auth = { userId: decodedToken.userId };

        // Passe au middleware suivant
        next();
    } catch(error) {
        let errorMessage = "Problème d'authentification";

        // Fournit des messages spécifiques selon l'erreur JWT
        if (error.name === 'TokenExpiredError') {
            errorMessage = "Le token a expiré";
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = "Le token est invalide";
        }

        // Envoie une réponse 401 avec le message d'erreur
        res.status(401).json({ message: errorMessage });
    }
    
}