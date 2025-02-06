const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Importation des modèles Activité et Donnée
const ActivityModel = (...args) => import('sport-track-db/ActivityModel.js').then(m => m.default);
const DataModel = (...args) => import('sport-track-db/DataModel.js').then(m => m.default);

// Fonction pour calculer la distance entre deux points géographiques
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Vérification de la structure du JSON
function checkJsonStructure(jsonData) {
    if (!('activity' in jsonData) || !('data' in jsonData)) {
        return { valid: false, message: 'Le JSON doit contenir les propriétés "activity" et "data"' };
    }
    if (!Array.isArray(jsonData.data)) {
        return { valid: false, message: 'La propriété "data" doit être un tableau' };
    }
    return { valid: true, message: 'Structure du JSON valide' };
}

// Vérification des objets dans le tableau "data"
function validateDataObjects(data) {
    const expectedKeys = ['time', 'cardio_frequency', 'latitude', 'longitude', 'altitude'];
    for (const item of data) {
        if (typeof item !== 'object' || item === null) {
            return { valid: false, message: 'Chaque entrée dans le tableau "data" doit être un objet' };
        }
        for (const key of expectedKeys) {
            if (!(key in item)) {
                return { valid: false, message: `L’objet doit contenir la clé: "${key}"` };
            }
        }
    }
    return { valid: true, message: 'Tous les objets dans "data" sont valides' };
}

// Méthode pour répondre aux méthodes GET, ici pour envoyer la vue
router.get('/', (req, res) => {
    if (req.session.email === undefined) {
        res.status(400).send("Vous devez être connecté pour accéder à cette interface de l'application");
        return;
    }
    res.render('upload_form');
});

// Méthode pour répondre aux méthodes POST, ici pour traiter l'envoi d'un fichier JSON
router.post('/', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads');
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            res.render('upload_valid', { message: "Aucun ficheir reçu", erreur: err.message });
            return;
        }

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file; // Gestion des fichiers multiples potentiels
        const filePath = uploadedFile.filepath;

        fs.readFile(filePath, async (err, data) => {
            if (err) {
                console.error(err);
                res.render('upload_valid', { message: null, erreur: err.message });
                return;
            }

            try {
                const jsonData = JSON.parse(data.toString()); // Parse le contenu du fichier en JSON

                // Vérification de la structure du JSON
                const structureResult = checkJsonStructure(jsonData);
                if (!structureResult.valid) {
                    res.render('upload_valid', { message: null, erreur: structureResult.message});
                    return;
                }

                // Vérification des objets dans "data"
                const dataResult = validateDataObjects(jsonData.data);
                if (!dataResult.valid) {
                    res.render('upload_valid', { message: null, erreur: dataResult.message});
                    return;
                }

                // Calcul de la durée et de la distance
                const startTime = new Date(`1970-01-01T${jsonData.data[0].time}Z`);
                const endTime = new Date(`1970-01-01T${jsonData.data[jsonData.data.length - 1].time}Z`);
                const durationInMinutes = (endTime - startTime) / 1000 / 60;

                let totalDistance = 0;
                for (let i = 0; i < jsonData.data.length - 1; i++) {
                    totalDistance += calculateDistance(
                        jsonData.data[i].latitude,
                        jsonData.data[i].longitude,
                        jsonData.data[i + 1].latitude,
                        jsonData.data[i + 1].longitude
                    );
                }

                const ActivityModelImported = await ActivityModel();
                const DataModelImported = await DataModel();

                // Enregistrement dans la base de données
                const activite = await ActivityModelImported.create({
                    emailUtilisateur: req.session.email,
                    date: jsonData.activity.date,
                    description: jsonData.activity.description,
                    heureDebut: jsonData.data[0].time,
                    duree: durationInMinutes.toFixed(2),
                    distance: totalDistance.toFixed(2),
                    freqCardiaqueMin: Math.min(...jsonData.data.map(d => d.cardio_frequency)),
                    freqCardiaqueMax: Math.max(...jsonData.data.map(d => d.cardio_frequency)),
                    freqCardiaqueMoy: (
                        jsonData.data.reduce((sum, d) => sum + d.cardio_frequency, 0) / jsonData.data.length
                    ).toFixed(2),
                });

                // Enregistrement des données liées à l'activité dans la base de données
                for (const data of jsonData.data) {
                    await DataModelImported.create({
                        idActivite: activite.idActivite,
                        temps: data.time,
                        frequenceCardiaque: data.cardio_frequency,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        altitude: data.altitude,
                    });
                }

                res.render('upload_valid', { message: "Fichier JSON lu avec succès", erreur: null});
            } catch (err) {
                console.error(err);
                res.render('upload_valid', { message: null, erreur: err.message});
                return;
            }
        });
    });
});

module.exports = router;
