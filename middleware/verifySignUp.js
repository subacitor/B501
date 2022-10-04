const { db } = require("../models/index.js");
const Op = db.Sequelize.Op;
const ROLES = db.ROLES;
const User = db.user;
checkDuplicateEmailOrUsername =  (req, res, next) => {
    let email = req.body.email;
    let username = req.body.username;
    User.findOne({
        where: {
            [Op.or]: [
                { email: email },
                { username: username }
            ]
        }
    }).then(user => {

        if (user) {
            return res.status(400).send({
                message: "Email or Username already exists"
            });
        }
       
        next();
    }
    ).catch(err => {
        
        res.status(500).send({
            message: "Error checking duplicate email or username"
        });
    }
    );

    // //Username
    // User.findOne({
    //     where: {
    //         username: req.body.username
    //     }
    // }).then(user => {
    //     if (user) {
    //         res.status(400).send({
    //             message: "Username is already in use"
    //         });
    //         return;
    //     }
    //     next();
    // }
    // ).catch(err => {
    //     res.status(500).send({
    //         message: "Error checking duplicate username | "+err
    //     });
    // }
    // );
    // //Email
    // User.findOne({
    //     where: {
    //         email: req.body.email
    //     }
    // }).then(user => {
    //     if (user) {
    //         res.status(400).send({
    //             message: "Email is already in use"
    //         });
    //         return;
    //     }
    //     next();
    // }
    // ).catch(err => {
    //     res.status(500).send({
    //         message: "Error checking duplicate email"
    //     });
    // }
    // );
}
// checkRolesExisted = (req, res, next) => {
    
//     let roles = req.body.roles;

//     for (let i = 0; i < roles.length; i++) {
//         let role = roles[i];
//         if (ROLES.indexOf(role) === -1) {
//             res.status(400).send({
//                 message: "Role is not existed"
//             });
//             return;
//         }
//     }
//     next();
// }

const verifySignUp = {
    checkDuplicateEmailOrUsername,
    //checkRolesExisted
}
module.exports = verifySignUp; 
// Compare this snippet from controllers\user.controller.js:
