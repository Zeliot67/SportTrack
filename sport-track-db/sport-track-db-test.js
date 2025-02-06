import User from './UserModel.js';
import Activity from './ActivityModel.js';
import Data from './DataModel.js'

let user;
let activite;
let donnee;

(async () => {
    console.log('Début des tests.');

    // Tests de création d'un utilisateur
    try {
        user = await User.create({
            email: 'test@example.com',
            nom: 'Doe',
            prenom: 'John',
            dateNaissance: '2000-01-01',
            sexe: 'M',
            taille: 180.00,
            poids: 70.00,
            motDePasse: 'securepassword',
        });
        console.log('Utilisateur créé : ', user);
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur : ", error);
    }

    // Tests de création d'une activité 
    try {
        activite = await Activity.create({
            emailUtilisateur: 'test@example.com',
            date: '2024-01-01',
            description: 'Course matinale',
            heureDebut: '08:00:00',
            duree: '01:00:00',
            distance: 5.0,
            freqCardiaqueMin: 60,
            freqCardiaqueMax: 180,
            freqCardiaqueMoy: 120,
        });
        console.log('Activité créée : ', activite);
    } catch (error) {
        console.error("Erreur lors de la création de l'activité : ", error);
    }

    // Tests pour la création d'une donnée d'activité
    try {
        donnee = await Data.create({
            idActivite: activite.idActivite,
            temps: '00:30:00',
            frequenceCardiaque: 150,
            latitude: 45.123456,
            longitude: -75.654321,
            altitude: 100.00,
        });
        console.log('Donnée créée : ', donnee);
    } catch (error) {
        console.error('Erreur lors de la création de données : ', error);
    }

    // Tests de lecture d'un utilisateur
    try {
        const user = await User.findByPk('test@example.com');
        console.log('Utilisateur lu : ', user);
    } catch (error) {
        console.error("Erreur lors de la lecture de l'utilisateur : ", error);
    }

    // Tests de lecture d'une activité
    try {
        const activiteLue = await Activity.findByPk(activite.idActivite);
        console.log('Activité lue : ', activiteLue);
    } catch (error) {
        console.error("Erreur lors de la lecture de l'activité : ", error);
    }

    // Tests de lecture d'une donnée d'activité
    try {
        const donneeLue = await Data.findByPk(donnee.idDonnee);
        console.log('Donnée lue : ', donneeLue);
    } catch (error) {
        console.error('Erreur lors de la lecture de données : ', error);
    }

    // Tests de modification d'un utilisateur
    try {
        const user = await User.findByPk('test@example.com');
        user.nom = 'Doe modifié';
        await user.save();
        console.log('Utilisateur modifié : ', user);
    } catch (error) {
        console.error("Erreur lors de la modification de l'utilisateur : ", error);
    }

    // Tests de modification d'une activité
    try {
        const activiteModifiee = await Activity.findByPk(activite.idActivite);
        activiteModifiee.description = 'Course matinale modifiée';
        await activiteModifiee.save();
        console.log('Activité modifiée : ', activiteModifiee);
    } catch (error) {
        console.error("Erreur lors de la modification de l'activité : ", error);
    }

    // Tests de modification d'une donnée d'activité
    try {
        const donneeModifiee = await Data.findByPk(donnee.idDonnee);
        donneeModifiee.temps = '00:45:00';
        await donneeModifiee.save();
        console.log('Donnée modifiée : ', donneeModifiee);
    } catch (error) {
        console.error('Erreur lors de la modification de données : ', error);
    }

    // Tests de suppression d'une donnée d'activité
    try {
        const donneeSupprimee = await Data.findByPk(donnee.idDonnee);
        await donneeSupprimee.destroy();
        console.log('Donnée supprimée : ', donneeSupprimee);
    } catch (error) {
        console.error('Erreur lors de la suppression de données : ', error);
    }

    // Tests de suppression d'une activité
    try {
        const activiteSupprimee = await Activity.findByPk(activite.idActivite);
        await activiteSupprimee.destroy();
        console.log('Activité supprimée : ', activiteSupprimee);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'activité : ", error);
    }

    // Tests de suppression d'un utilisateur
    try {
        const user = await User.findByPk('test@example.com');
        await user.destroy();
        console.log('Utilisateur supprimé : ', user);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur : ", error);
    }
})();
