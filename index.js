const express = require("express");
// const cors = require("cors");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const authFirebase = require("./route/authFirebase.js");
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');
const authroutes = require("./route/auth.routes.js");
const userroutes = require("./route/user.routes.js");
const calenderRoutes = require("./route/calender.routes.js");
const regCalenderRoutes = require("./route/regCalender.routes.js");
dotenv.config();
const mluter = require("multer");
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument(options)));
// parse requests of content-type - application/json
app.use(express.json());
//use cross origin resource sharing
app.use(cors());
//use cors allow all origin

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept",
  // );
  next();
});
app.use("/api/auth/firebase", authFirebase);
app.use("/api/auth", authroutes);
app.use("/api/user", userroutes);
app.use("/api/calender", calenderRoutes);
app.use("/api/reg_calender", regCalenderRoutes);



const PORT = process.env.PORT || 3000;

const { db } = require("./models/index.js");

db.sequelize.sync().then(() => {
  console.log("Database connected successfully");


}).catch(err => {
  console.log("Error connecting to database", err);
});
app.listen(PORT, () => {
 
  console.log(`Server is running on port ${PORT}.`);
});
