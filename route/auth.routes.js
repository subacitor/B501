const { verifySignUp } = require("../middleware")
const { signin, signup } = require("../controllers/auth.controller");
const express = require('express');
const router = express.Router();


router.post("/signup", [
    verifySignUp.checkDuplicateEmailOrUsername,
], signup)


router.post("/signin", signin)

module.exports = router 
