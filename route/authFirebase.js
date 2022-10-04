const express = require('express');


const router = express.Router();
const {
    signinWithTokenFirebase,
    signupWithEmailAndPassword,
    forgotPassword,
    createCustomToken,
    updateUser,
    revokeRefreshTokens,
    setAdmin,
    checkingAdmin,
    revokeAdmin,
    signinWithEmailPassword,
    signupWithAmonymous,
    signinWithAmonymous,
    updatePasswordwithAmonymous,
    linkWithEmailAndPassword,

} = require('../controllers/authFirebase.controller.js');
const { verifyTokenFirebase, isAdminFirebase } = require('../middleware/firebaseMDL.js');
//authencation
router.post('/signup', signupWithEmailAndPassword);
router.post('/signin', signinWithEmailPassword);
//authorization
router.post('/authorzation', verifyTokenFirebase, signinWithTokenFirebase);
//check admin
router.post('/checkingAdmin', isAdminFirebase, checkingAdmin);

//SET Admin
router.post('/setAdmin/:uid', setAdmin);
//revoke admin
router.post('/revokeAdmin/:uid', revokeAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/createToken', createCustomToken);
router.post('/signinWithToken', verifyTokenFirebase, signinWithTokenFirebase);
router.post('/signupWithAmonymous', signupWithAmonymous);
router.post('/signinWithAmonymous', verifyTokenFirebase, signinWithAmonymous);
router.post('/changePassAnonymous', verifyTokenFirebase, updatePasswordwithAmonymous);
//sign out
router.post('/revokeToken/:uid', revokeRefreshTokens);
//link account with email password
router.post('/linkWithEmailAndPassword', verifyTokenFirebase, linkWithEmailAndPassword);

//update user
router.put('/updateUser', updateUser);



module.exports = router;