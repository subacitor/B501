module.exports = {
    HOST: "localhost",
    PORT: 3306,
    USER: "root",
    PASSWORD: "",
    DB: "calender_manger",
    dialect: "mysql",
    pool: {
        max: 9999,
        min: 0,
        acquire: 999999,
        idle: 10000
    },
    timeZone: "+07:00"
};