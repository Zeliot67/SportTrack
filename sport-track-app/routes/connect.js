var express = require('express');
var router = express.Router();

// Importation du modèle User
const UserModel = (...args) => import('sport-track-db/UserModel.js').then(m => m.default);

// Méthode GET pour afficher le formulaire de connexion
router.get('/', (req, res) => {
    res.render('connect_form');
});

// Méthode POST pour vérifier les informations de connexion
router.post('/', async (req, res) => {
    const { email, motDePasse } = req.body;

    // Vérification des informations de connexion
    const UserModelImported = await UserModel();
    const user = await UserModelImported.findOne({ where: { email: email, motDePasse: motDePasse } });

    // Si l'utilisateur est trouvé, redirection vers activites.pug
    if (user) {
        req.session.email = user.email;
        req.session.prenom = user.prenom;
        return res.redirect('activities');
    }

    // En cas d'échec, retour au formulaire avec un message d'erreur
    res.render('connect_form', { message: 'Identifiant au mot de passe incorrect.' });
});

module.exports = router;