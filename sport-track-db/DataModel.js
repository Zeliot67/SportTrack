import Sequelize from 'sequelize';
const DataTypes = Sequelize.DataTypes;

// Initialisation de Sequelize avec une base de données SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sport_track.db',
});

const Donnee = sequelize.define('Donnee', {
    idDonnee: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idActivite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Activite',
            key: 'idActivite',
        },
    },
    temps: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    frequenceCardiaque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
            min: -90,
            max: 90,
        },
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
            min: -180,
            max: 180,
        },
    },
    altitude: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: false, // Pour désactiver les champs createdAt et updatedAt
});

export default Donnee;