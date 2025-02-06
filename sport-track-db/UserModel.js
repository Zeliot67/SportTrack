import Sequelize from 'sequelize';
const DataTypes = Sequelize.DataTypes;

// Initialisation de Sequelize avec une base de données SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sport_track.db',
});

const Utilisateur = sequelize.define('Utilisateur', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
            isEmail: true,
        },
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateNaissance: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sexe: {
        type: DataTypes.ENUM('M', 'F'),
        allowNull: false,
    },
    taille: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        validate: {
            min: 0.01,
            max: 250.00,
        },
    },
    poids: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 0.01,
            max: 500.00,
        },
    },
    motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false, // Pour désactiver les champs createdAt et updatedAt
});

export default Utilisateur;
