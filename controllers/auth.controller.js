const { db } = require('../models/index.js');
const config = require("../config/config.js");
const { secret } = require("../config/auth.config.js");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = (req, res) => {
    User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
        displayName: req.body.displayName,
        mssv: req.body.mssv,
        photoURL: req.body.photoURL,
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}
const signin = (req, res) => {
    User.findOne({
        where: {
            mssv: req.body.mssv
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User Not Found"
            });
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        // jwt($payload, $private_key, "RS256")
        var token = jwt.sign({ uid: user.uid }, secret, {
            expiresIn: 86400 // expires in 24 hours
            , algorithm: 'RS256'
        });
        
        res.status(200).send({
            uid: user.uid,
            email: user.email,
            accessToken: token,
        })

    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}



module.exports = {
    signup,
    signin
}