import Sequelize from 'sequelize';
const DataTypes = Sequelize.DataTypes;

// Initialisation de Sequelize avec une base de données SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sport_track.db'
});

// Définition du modèle Activité
const Activite = sequelize.define('Activite', {
    idActivite: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    emailUtilisateur: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
        references: {
            model: 'Utilisateur',
            key: 'email',
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    heureDebut: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    duree: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    freqCardiaqueMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    freqCardiaqueMax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    freqCardiaqueMoy: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
            isBetween(value) {
                if (value < this.freqCardiaqueMin || value > this.freqCardiaqueMax) {
                    throw new Error('La fréquence cardiaque moyenne doit être comprise entre la fréquence cardiaque minimale et maximale');
                }
            },
        },
    },
}, {
    timestamps: false, // Pour désactiver les champs createdAt et updatedAt
});

export default Activite;