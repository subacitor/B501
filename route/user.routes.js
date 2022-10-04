const { authJwt } = require('../middleware');
const { getAllUser, getUserById, deleteUser, getUserRegCaledar, createUser, get_Calender_available, userUploadAvatar, uploadAvatar } = require("../controllers/user.controller")
const express = require('express');
const { db } = require('../models');
const { updateUser } = require('../controllers/authFirebase.controller');
const { verifyTokenFirebase, isAdminFirebase } = require('../middleware/firebaseMDL');
const { uploadImageFirestore, Mluter } = require('../services/HandleUploadService');
const router = express.Router();
const User = db.user;

router.get('/getAllUser', isAdminFirebase, getAllUser);
router.get('/getUserById/:uid', isAdminFirebase, getUserById);
router.get('/getUserRegCaledar', verifyTokenFirebase, getUserRegCaledar);
router.get(
    '/get_Calender_available', get_Calender_available
);
router.post('/test',[Mluter.single('image'),uploadImageFirestore],userUploadAvatar)
//create user
router.post("/createUser", createUser);
/*Edit user */
router.put("/edit/:uid", verifyTokenFirebase, updateUser);
/*Delete User*/
router.delete("/delete/:uid", isAdminFirebase, deleteUser);


module.exports = router 