const { authJwt } = require('../middleware');
const { verifyTokenFirebase, isAdminFirebase } = require('../middleware/firebaseMDL.js');
const { create_reg_calender, get_reg_calender, accpet_Reg_Calender, status_reg_calender, get_reg_calender_active, update_reg_calender, delete_reg_calender, change_status_user, delete_reg_calender_user } = require("../controllers/reg_calender.controller")
const express = require('express');
const router = express.Router();

/*Lấy tất cả user đăng kí[admin] */
router.get('/get_reg_calender', isAdminFirebase, get_reg_calender);
//lấy ra tất cả những user đăng kí đc duyệt[admin]
router.get('/get_reg_calender_active', isAdminFirebase, get_reg_calender_active);
//Đăng kí lịch
router.post("/create/:calender_id", verifyTokenFirebase, create_reg_calender);
//Duyệt đăng kí lịch[admin]
router.post("/accpet_reg_ralender/:id", isAdminFirebase, accpet_Reg_Calender);
//thay đổi trạng thái đăng kí lịch[admin]
router.put("/change_status/:id", isAdminFirebase, status_reg_calender);
//user thay đổi trạng thái đăng kí
router.put("/change_status_user/:id", verifyTokenFirebase, change_status_user);

//cập nhật lịch
router.put("/update/:id", verifyTokenFirebase, update_reg_calender);
//Xóa lịch đăng kí của user [admin]
router.delete("/delete_reg_calender/:id", isAdminFirebase, delete_reg_calender);
router.delete("/delete_reg_calender_user/:id", verifyTokenFirebase, delete_reg_calender_user);


module.exports = router 