const config = require("../config/config.js");
const Sequelize = require("sequelize");
const { calender, Calender } = require("./calender.model.js")
const { reg_calender, Reg_Calender } = require("./reg_calender.model.js")
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    port: config.PORT,
    operatorsAliases: 0,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    timezone: config.timeZone
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
// db.role = require("./role.model.js")(sequelize, Sequelize);
db.calender = Calender(sequelize, Sequelize);
db.reg_calender = Reg_Calender(sequelize, Sequelize);
//1 reg_calender has one calender and one user

db.user.hasMany(db.reg_calender, { foreignKey: "user_id" });
db.reg_calender.belongsTo(db.user,
  { foreignKey: "user_id" });

db.calender.hasMany(db.reg_calender, { foreignKey: "calender_id" });
db.reg_calender.belongsTo(db.calender,
  { foreignKey: "calender_id" });
module.exports = { db };