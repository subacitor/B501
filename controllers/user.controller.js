const { db } = require('../models/index');
const User = db.user;
const Reg_Calender = db.reg_calender;
const Calender = db.calender;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");
const { defaultApp,storageFire, defaultAppConfig } = require('../config/firebase');
const multer = require('multer');
const path = require('path');
const firebaseAdmin = defaultApp.auth();

const createUser = (req, res) => {
    // Validate request
    try {
        User.findOne({
            where: {
                uid: req.body.uid
            }
        }).then(user => {
            if (user) {
                res.status(200).send({
                    message: "User already exists."
                });
            }
            else {
                User.findByPk(req.body.uid).then((user) => {
                    // Create a User
                    User.create({
                        uid: req.body.uid,
                        displayName: req.body.displayName,
                        email: req.body.email,
                        photoURL: req.body.photoURL,
                        phoneNumber: req.body.phoneNumber,
                    }).then(user => {
                        res.status(201).json({
                            message: "User was created successfully!",
                            user: user
                        });
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating User."
                        });
                    })

                }
                ).catch(err => {
                    console.log(err)
                })

            }
        })
    } catch (error) {
        console.log(error)
    }


}
const getUserById = (req, res) => {
    //findone by uuid
    User.findOne({
        where: {
            uid: req.params.uid
        }
    }).then((user) => {
        if (user) {
            firebaseAdmin.getUser(req.params.uid).then(user => {
                if (user) {
                    res.status(200).json({
                        message: "Get User Successfully!",
                        data: user
                    })
                }
                else {
                    res.status(400).send({
                        message: "User NOT FOUND."
                    });
                }
            })

        }
        else {
            res.status(400).send({
                message: "User was not found."
            });
        }
    }
    ).catch(err => {
        res.status(500).send({
            message: err.message
        });
    }
    );

}

const getAllUser = (req, res) => {
    User.findAll().then(user => {
        res.status(200).json({
            message: "Get all user successfully!",
            data: user
        })
    }
    ).catch(err => {
        res.status(500).send({
            message: err.message
        });
    }
    );
}

const deleteUser = (req, res) => {
    const uid = req.params.uid;
    firebaseAdmin.deleteUser(uid).then(() => {
        User.findOne({
            where: {
                uid: uid
            }
        }).then((user) => {
            if (user) {
                User.destroy({
                    where: {
                        uid: uid
                    }
                }).then(() => {
                    res.status(200).json({
                        message: "Delete User Successfully!"
                    })
                }
                ).catch(err => {

                    res.status(500).send({
                        message: err.message || "Some error occurred while deleting User."
                    });
                }
                );
            }
            else {
                res.status(400).send({
                    message: "User NOT FOUND."
                });
            }
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting User."
        });
    })

}
const get_Calender_available = (req, res) => {
    Calender.findAll({
        where: {
            available: true
        }
    }).then(calender => {
        res.status(200).json({
            message: "Get all calender successfully!",
            data: calender
        })
    })
}
//người dùng xem lại những lịch mình đăng kí
const getUserRegCaledar = (req, res) => {

    User.findByPk(req.userId).then((user) => {
        if (user) {
            Reg_Calender.findAll({
                where: {
                    user_id: req.userId
                },
                include: [{
                    model: Calender,
                    attributes: ['id', 'DayOftheweek', 'SessionDay', 'available', 'capacity']
                }, {
                    model: User,
                    attributes: ['uid', 'displayName', 'email', 'phoneNumber', 'photoURL',]
                }]
            }).then((reg_calender) => {
                res.status(200).json({
                    message: "Get User Reg Calender  Successfully!",
                    data: reg_calender
                })
            }
            ).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            }
            );
        }
        else {
            res.status(400).send({
                message: "User was not found."
            });
        }
    }
    ).catch(err => {
        res.status(500).send({
            message: err.message
        });
    }
    );
}
const stroage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/avatar');
    }
    ,
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const uploadAvatar = multer({
    storage: stroage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb("Error: Images Only!");


    }
}).single('avatar');

const userUploadAvatar = (req, res) => {
    res.send({
        message: "Upload avatar successfully!",
        data:req.file
    });
    // const image = req.file;
    // if (!image) {
    //     return res.status(400).send({
    //         message: "No file uploaded!"
    //     });
    // }
    
    // const filename = Date.now() + path.extname(image.originalname);
    // const file=storageFire.file(filename);
    
    // const stream = file.createWriteStream({
    //     metadata: {
    //         contentType: image.mimetype
    //     }
    // });
    // stream.on("error", (err) => {
    //     console.log(err)
    //     res.status(500).send({
    //         message: err.message
    //     });
    // })
    // stream.on("finish",async() => {
    //   await  file.makePublic().then(() => {
    //         res.status(200).json({
    //             message: "Upload avatar successfully!",
    //             data: {
    //                 url: file.publicUrl
    //             }
    //         })
    //     }
    //     ).catch(err => {
    //         res.status(500).send({
    //             message: err.message
    //         });
    //     })
    //     req.file.firebaseUrl = `https://firebasestorage.googleapis.com/${defaultAppConfig.storageBucket}/${file.name}`;
    // })
    // stream.end(image.buffer);
   
}
module.exports = {
    getAllUser, deleteUser, getUserRegCaledar, createUser, getUserById, get_Calender_available,
    uploadAvatar, userUploadAvatar
}
