const { authJwt } = require('../middleware');
const { test, create_Calender, delete_Calender, get_Calender, get_Calender_by_id, update_Calender, create_Calender_user } = require("../controllers/calender.controller")
const express = require('express');
const { verifyTokenFirebase, isAdminFirebase } = require('../middleware/firebaseMDL');
const router = express.Router();

router.get("/get", get_Calender);
router.get("/get/:id", get_Calender_by_id);
router.post("/create",isAdminFirebase, create_Calender);
router.put("/update/:id", isAdminFirebase, update_Calender);
router.delete("/delete/:id", isAdminFirebase, delete_Calender);
module.exports = router