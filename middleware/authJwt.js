const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.config.js');
const { db } = require('../models/index.js');

const User = db.user;

const verifyToken = (req, res, next) => {


    try {

        let token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Invalid token' });
            }
            req.userId = decoded.uid;
            next();
        });
    } catch (error) {

        return res.status(400).send({ message: "Token is required" });
    }

}
const isAdmin = async (req, res, next) => {
    verifyToken(req, res, () => {
        User.findByPk(req.userId).then(user => {
            // console.log(user)
            var isAdmin = false;
            user.getRoles().then(roles => {
                // console.log(roles)
                if (roles.length > 0) {
                    roles.forEach((e) => {
                        console.log(e.name);
                        if (e.name === 'admin') {
                            isAdmin = true;

                        }
                    })
                    //  console.log(isAdmin);
                    if (isAdmin) {
                        next();
                    }
                    else {
                        res.status(401).send({ message: 'You are not authorized' });
                    }
                } else {
                    return res.status(401).send({ message: "Not find roles by user" });
                }
            }).catch(err => {
                return res.status(401).send({ message: err.message });
            })
        }).catch(err => {
            return res.status(401).send({ message: err.message });
        })

    })



};
const isModerator = (req, res, next) => {

    verifyToken(req, res, () => {
        User.findByPk(req.userId).then(user => {
            var isModerator = false;
            user.getRoles().then(roles => {
                if (roles.length > 0) {
                    roles.forEach((e) => {
                        if (e.name === 'moderator') {
                            isModerator = true;

                        }
                        else {
                            isModerator = false;
                        }
                    }
                    )
                    if (isModerator) {
                        next();
                    }
                    else {
                        res.status(401).send({ message: 'You are not authorized' });
                    }
                } else {
                    return res.status(401).send({ message: "Not find roles by user" });
                }
            }).catch(err => {
                return res.status(401).send({ message: err.message });
            }
            )
        }).catch(err => {
            return res.status(401).send({ message: err.message });
        })

    })


};

const isModeratorOrAdmin = (req, res, next) => {
    // User.findByPk(req.userId).then(user => {
    //     user.getRoles().then(roles => {
    //         if (roles.length > 0) {
    //             for (let i = 0; i < roles.length; i++) {
    //                 if (roles[i].name === 'moderator' || roles[i].name === 'admin') {
    //                     next();
    //                     return;
    //                 }
    //             }
    //         }
    //         res.status(401).send({ message: 'You are not authorized' });
    //     });
    // });
}
const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
}
module.exports = authJwt;