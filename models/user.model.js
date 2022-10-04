module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', { //User is the table name
        uid: {
            allowNull: true,
            type: Sequelize.STRING,
            primaryKey: true,
        },
        password: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        displayName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        photoURL: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        mssv: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        emailVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        disabled: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    });
    return User;
}
