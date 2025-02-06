const express = require('express');
const { exit } = require('process');
const router = express.Router();

// Importation du modèle Activité
const ActivityModel = (...args) => import('sport-track-db/ActivityModel.js').then(m => m.default);

// Route pour obtenir les activités de l'utilisateur connecté
router.get('/', async (req, res) => {
    if (req.session.email === undefined) {
        res.status(400).send("Vous devez être connecté pour accéder à cette interface de l'application");
        return;
    }
    try {
        const ActivityModelImported = await ActivityModel();
        const activites = await ActivityModelImported.findAll({
            where: { emailUtilisateur: req.session.email }
        });
        res.render('activities', { activites });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des activités');
    }
});

module.exports = router;
