var express = require('express');
var router = express.Router();

// Importation dynamique du modèle User
const UserModel = (...args) => import('sport-track-db/UserModel.js').then(m => m.default);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user_form_create');
});

router.post('/', async (req, res) => {
  try {
    const { prenom, nom, sexe, poids, taille, dateNaissance, email, motDePasse, confirmationMotDePasse } = req.body;

    // Vérification de la confirmation du mot de passe
    if (motDePasse !== confirmationMotDePasse) {
      res.render('user_form_valid', { message: null, erreur: 'Erreur de confirmation du mot de passe, les mots de passe ne sont pas identiques' });
    } else {
      // Récupération du modèle User
      const UserModelImported = await UserModel();

      // Vérification de l'existence du compte utilisateur
      const existingUser = await UserModelImported.findByPk(email);
      if (existingUser) {
        res.render('user_form_valid', { message: null, erreur: "Email déjà utilisé" });
      } else {
        // Création de l'utilisateur
        const user = await UserModelImported.create({
          email,
          nom,
          prenom,
          dateNaissance,
          sexe,
          taille,
          poids,
          motDePasse,
        });
        res.render('user_form_valid', { message: 'Compte utilisateur créé avec succès', erreur: null });
      }
    }
  } catch (error) {
    res.render('user_form_valid', { message: null, erreur: error.message });
  }
});

module.exports = router;
