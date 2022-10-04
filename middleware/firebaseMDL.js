const { defaultAuth, defaultAppConfig } = require('../config/firebase.js');
const { db } = require('../models/index.js');
const User = db.user;
const { default: axios } = require('axios');

const verifyTokenFirebase = (req, res, next) => {
    //bear token Authorzation
    try {
        let token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }
        //verify token with firebase

        defaultAuth.verifyIdToken(token).then(function (decodedToken) {
            // console.log(decodedToken);
            // ...
            if (decodedToken) {
                req.userId = decodedToken.uid;
                console.log(req.userId);
                next();
            }
            else {
                res.status(401).send({ message: 'Invalid token' });
            }
        }).catch(function (error) {
            //verify token with firebase
            if (error.code === "auth/argument-error" || error.message === "verifyIdToken() expects an ID token, but was given a custom token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.") {

                axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${defaultAppConfig.apiKey}`, {
                    token: token,
                    returnSecureToken: true,
                }).then(async (response) => {
                    defaultAuth.verifyIdToken(response.data.idToken).then(function (decodedToken) {
                        console.log(decodedToken);
                        // ...
                        if (decodedToken) {
                            req.userId = decodedToken.uid;
                            req.isAdmin = decodedToken.isAdmin;
                            console.log(req.userId);

                            next();
                        }
                        else {
                            res.status(401).send({ message: 'Invalid token' });
                        }
                    }).catch(function (error) {
                        console.log(error);

                        res.status(500).send({
                            message: "Error verifying token || Token Sai",
                            message2: error.message
                        });
                    })
                }
                ).catch(function (error) {
                    console.log(error);
                    res.status(500).send({
                        message: "Error verifying token || Token Sai",
                        message2: error.message
                    });
                }
                );
            }
            else {
                res.status(500).send({
                    message: "Error verifying token || Token Sai",
                    message2: error.message
                });
            }

        }
        );


    } catch (error) {
        res.status(400).send({ message: "Token is required" });
        console.log(error.message)
    }

}
const verifyCustomToken = (req, res, next) => {
    //bear token Authorzation
    try {
        let token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }
        //verify token with firebase
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${defaultAppConfig.apiKey}`, {
            token: token,
            returnSecureToken: true,
        }).then(async (response) => {
            defaultAuth.verifyIdToken(response.data.idToken).then(function (decodedToken) {
                console.log(decodedToken);
                // ...
                if (decodedToken) {
                    req.userId = decodedToken.uid;
                    console.log(req.userId);

                    next();
                }
                else {
                    res.status(401).send({ message: 'Invalid token' });
                }
            }).catch(function (error) {
                console.log(error);

                res.status(500).send({
                    message: "Error verifying token || Token Sai",
                    message2: error.message
                });
            })
        }
        ).catch(function (error) {
            console.log(error);
            res.status(500).send({
                message: "Error verifying token || Token Sai",
                message2: error.message
            });
        }
        );
    }
    catch
    (error) {
        res.status(400).send({ message: "Token is required" });
        console.log(error.message)
    }
}
const isAdminFirebase = async (req, res, next) => {
    try {

        defaultAuth.verifyIdToken(req.header('Authorization').replace('Bearer ', '')).then(function (role) {
            console.log(role);
            if (role.admin) {
                req.userId = role.uid;
                console.log(req.userId);

                next();
            }
            else {
                res.status(401).send({ message: 'You are not authorized' });
            }

        }).catch(function (error) {
            if (error.code === "auth/argument-error" || error.message === "verifyIdToken() expects an ID token, but was given a custom token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.") {

                axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${defaultAppConfig.apiKey}`, {
                    token: req.header('Authorization').replace('Bearer ', ''),
                    returnSecureToken: true,
                }).then(async (response) => {
                    defaultAuth.verifyIdToken(response.data.idToken).then(function (decodedToken) {
                        console.log(decodedToken);
                        // ...
                        if (decodedToken) {
                            req.userId = decodedToken.uid;
                            if (decodedToken.isAdmin === true) {
                                next();
                            }
                            else {
                                res.status(401).send({ message: 'You are not authorized' });
                            }

                        }
                        else {
                            res.status(401).send({ message: 'Invalid token' });
                        }
                    }).catch(function (error) {
                        console.log(error);

                        res.status(500).send({
                            message: "Error verifying token || Token Sai",
                            message2: error.message
                        });
                    })
                }
                ).catch(function (error) {
                    console.log(error);
                    res.status(500).send({
                        message: "Error verifying token || Token Sai",
                        message2: error.message
                    });
                }
                );
            }
            else {
                res.status(500).send({
                    message: "Error verifying token || Token Sai",
                    message2: error.message
                });
            }

        })
    } catch (error) {
        res.status(400).send({ message: "Token is required" });
        console.log(error.message)
    }


}
module.exports = {
    verifyTokenFirebase,
    isAdminFirebase,
    verifyCustomToken
}
