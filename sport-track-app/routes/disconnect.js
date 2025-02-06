const express = require('express');
const router = express.Router();

// Méthode GET pour déconnecter l'utilisateur de l'application web
router.get('/', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send('Erreur lors de la déconnexion');
            } else {
                res.redirect('/'); // Redirection vers la page de connexion
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;
