const { default: axios } = require('axios');
const { hashSync, compareSync } = require('bcryptjs');
const { defaultApp, firestore, defaultAppConfig } = require('../config/firebase.js');
const { db } = require('../models/index.js');
const firebaseAdmin = defaultApp.auth();
const User = db.user;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const additionalClaims = {
    premiumAccount: true,
};

const updateUser = (req, res) => {
    const uid = req.params.uid;
    if (!uid) {
        res.status(400).send({
            uid: "UID is required"
        });
    }
    else {
        firebaseAdmin.updateUser(uid, {
            displayName: req.body.displayName,
            photoURL: req.body.photoURL,
        }).then(user => {
            if (user) {
                User.update({
                    displayName: req.body.displayName,
                    photoURL: req.body.photoURL,

                }, {
                    where: {
                        uid: uid
                    }
                }).then((userSQL) => {
                    if (userSQL) {
                        res.status(200).send({
                            message: "Update User Successfully!",
                        })
                    }
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: "Đồng bộ hóa ngày giờ và thử lại!",
                error: err.message
            });
        })

    }
}
const signupWithAmonymous = (req, res) => {
    /*
        curl 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]' \
-H 'Content-Type: application/json' --data-binary '{"returnSecureToken":true}'
    */
    try {
        ;

        // if (!req.body.mssv && !req.body.password) {
        //     res.status(400).send({
        //         mssv: "MSSV is required",
        //         password: "Password is required"
        //     });
        // }
        //mssv and password and email are required
        if (!req.body.mssv && !req.body.password || !req.body.email && !req.body.password) {
            res.status(400).send({
                email: "Email is required",
                mssv: "MSSV is required",
                password: "Password is required"
            });
        }
        else {

            axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${defaultAppConfig.apiKey}`, {
                returnSecureToken: true,
                email: req.body.email
            }).then(async (response) => {
                if (response.status === 200) {
                    const user = {
                        uid: response.data.localId,
                        email: response.data.email,
                        mssv: req.body.mssv,
                        password: hashSync(req.body.password, 8),
                    }
                    await User.create(user).then(result => {
                        if (result) {
                            console.log("save user from MySql  success");
                        }
                        res.status(200).send({
                            message: "Create User Successfully!",
                            data: {
                                uid: response.data.localId,
                                idToken: response.data.idToken,
                                expiresIn: response.data.expiresIn,
                                refreshToken: response.data.refreshToken,
                            }
                        })
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send({
                            message: err.message
                        });
                    }
                    )
                }
            }
            ).catch(err => {
                res.status(500).send({
                    message: err
                });
            }
            )
        }

    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
}
const signinWithAmonymous = (req, res) => {
    if (!req.body.mssv && !req.body.password) {
        res.status(400).send({
            mssv: "MSSV is required",
            password: "Password is required"
        });
    }
    else {
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
                    message: "Invalid Password!"
                });
            }
            else {


                res.status(200).send({
                    uid: user.uid,
                    mssv: user.mssv,
                })
            }

        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }
}
const updatePasswordwithAmonymous = (req, res) => {
    if (!req.body.mssv && !req.body.password) {
        res.status(400).send({
            mssv: "MSSV is required",
            password: "Password is required"
        });
    }
    else {
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
            User.update({
                password: hashSync(req.body.password, 8),
            }, {
                where: {
                    mssv: req.body.mssv
                }
            }).then(userSQL => {
                if (userSQL) {
                    res.status(200).send({
                        message: "Update Password Successfully!",
                    })
                }
            }
            ).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            }
            )
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    }
}
//set role Admin
const setAdmin = (req, res) => {
    if (!req.params.uid) {
        res.status(400).send({
            uid: "UID is required"
        });
    }
    else {
        firebaseAdmin.setCustomUserClaims(req.params.uid, { admin: true }).then(() => {

            res.status(200).send({
                message: "Set Admin Successfully!",
                note: "Please logout and login again get token new !"
            })
        })
    }
}
const revokeAdmin = (req, res) => {
    if (!req.params.uid) {
        res.status(400).send({
            uid: "UID is required"
        });
    }
    else {
        firebaseAdmin.setCustomUserClaims(req.params.uid, { admin: false }).then(() => {

            res.status(200).send({
                message: "Revoke Admin Successfully!",
                note: "Please logout and login again get token new !"
            })
        })
    }
}
const checkingAdmin = (req, res) => {
    res.status(200).send({
        message: "You Admin"
    })
}
//serviceAccountId: 'my-client-id@my-project-id.iam.gserviceaccount.com',
const signupWithEmailAndPassword = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            email: "Email is required",
            password: "Password is required"
        });
    }

    firebaseAdmin.createUser({
        email: req.body.email,
        password: req.body.password,
    }).then(async user => {
        if (user) {
            await User.create({
                uid: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                disabled: user.disabled,

            }).then(result => {
                if (result) {
                    console.log("save user from MySql  success");
                }
                res.status(200).send({
                    message: "Create User Successfully!",
                    data: {
                        uid: user.uid,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        emailVerified: user.emailVerified,
                        disabled: user.disabled,

                    }
                })
            }).catch(err => {
                console.log(err);
            })

        }
        res.status(200).send({
            message: "Create User Successfully!",
        })

    }
    ).catch(async err => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating User."
            });
        }
    }
    );

}

const signinWithEmailPassword = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            email: "Email is required",
            password: "Password is required"
        });
    }
    else {
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${defaultAppConfig.apiKey}`, {
            email: req.body.email,
            password: req.body.password,
            returnSecureToken: true
        }).then(async response => {
            res.status(200).send({
                message: "Signin Successfully!",
                data: {
                    uid: response.data.localId,
                    email: response.data.email,
                    type: response.data.kind,
                    displayName: response.data.displayName,
                    photoURL: response.data.profilePicture,
                    status: response.data.registered,
                    access_token: response.data.idToken,
                    refresh_token: response.data.refreshToken,
                    expires_in: response.data.expiresIn
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send({
                    message: err.message
                });
            })
        })
    }

}
// Thu hồi tất cả các mã làm mới cho một người dùng được chỉ định vì bất kỳ lý do gì.
// Truy xuất dấu thời gian của việc thu hồi, tính bằng giây kể từ kỷ nguyên.
const revokeRefreshTokens = (req, res) => {
    const uid = req.params.uid;
    if (!uid) {
        res.status(400).send({
            message: "User ID is required"
        });
    }
    firebaseAdmin.revokeRefreshTokens(uid).then(() => {
        const data = firebaseAdmin.getUser(uid);

        res.status(200).send({
            message: "Revoke Refresh Tokens Successfully!",
            data: data
        })
    }
    ).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while revoking Refresh Tokens."
        });
    }
    );
}
//tạo user with token custom
const createCustomToken = (req, res) => {
    //greaner uid from req.params.uid



    const uid = crypto.randomBytes(16).toString('hex');
    const additionalClaims = {
        isAdmin: false,
        isAnonymous: true,
    };
    firebaseAdmin.createUser({
        uid: uid,
        email: req.body.email,
        password: req.body.password,
        mssv: req.body.mssv,
    }).then((user) => {
        firebaseAdmin.setCustomUserClaims(uid, additionalClaims).then(() => {
            firebaseAdmin.createCustomToken(uid, additionalClaims).then(token => {
                if (token) {
                    User.create({
                        uid: user.uid,
                        mssv: req.body.mssv,
                    }).then((userSQL) => {
                        if (userSQL) {
                            res.status(200).send({
                                message: "Create User Successfully!",
                                token: token,
                                data: {
                                    uid: token.uid,
                                    token: token
                                }
                            })
                        }
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message
                        });
                    }
                    )
                }
            }
            ).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating Custom Token."
                });
            })

        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating User."
        });
    }
    );


}
const signinWithTokenFirebase = (req, res) => {

    res.json({
        message: "Authorized successfully . Please use token to access APIs",
        userId: req.userId
    })
}
//gửi mail reset password
const sendEmailResetPassword = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=[API_KEY]' \
 -H 'Content-Type: application/json' \
 --data-binary '{"requestType":"PASSWORD_RESET","email":"[user@example.com]"}'
    */
    if (!req.body.email) {
        res.status(400).send({
            email: "Email is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${defaultAppConfig.apiKey}`, {
            requestType: "PASSWORD_RESET",
            email: req.body.email
        }).then(async (response) => {
            if (response) {
                res.status(200).send({
                    message: "Send Email Successfully!",
                    data: response.data
                })
            }
            else {
                res.status(500).send({
                    message: "Some error occurred while sending Email."
                });
            }
        })
    }


}
//check code reset password
const checkObbCodeResetPassword = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=[API_KEY]' \
-H 'Content-Type: application/json' --data-binary '{"oobCode":"[PASSWORD_RESET_CODE]"}'*/
    if (!req.body.oobCode) {
        res.status(400).send({
            oobCode: "OobCode is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${defaultAppConfig.apiKey}`, {
            oobCode: req.body.oobCode
        }).then(async (response) => {
            if (response) {
                res.status(200).send({
                    message: "Check OobCode Successfully!",
                    data: response.data
                })
            }
            else if (response.data.error.code == "INVALID_OOB_CODE") {
                res.status(400).send({
                    message: "Invalid OobCode"
                });
            }
            else if (response.data.error.code == "EXPIRED_OOB_CODE") {
                res.status(400).send({
                    message: "Expired OobCode"
                });
            }
            else {
                res.status(500).send({
                    message: "Some error occurred while checking OobCode."
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while checking OobCode."
            });
        }
        );
    }
}
//reset password
const verifyResetPassword = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary '{"oobCode":"[PASSWORD_RESET_CODE]","newPassword":"[NEW_PASSWORD]"}'
    */
    try {
        if (!req.body.oobCode || !req.body.newPassword) {
            res.status(400).send({
                oobCode: "OobCode is required",
                newPassword: "New Password is required"
            });
        }

        else {
            axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${defaultAppConfig.apiKey}`, {
                oobCode: req.body.oobCode,
                newPassword: req.body.newPassword
            }).then(async (response) => {
                if (response) {
                    res.status(200).send({
                        message: "Verify Reset Password Successfully!",
                        data: response.data
                    })
                }
                else {
                    res.status(500).send({
                        message: "Some error occurred while verifying Reset Password."
                    });
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while verifying Reset Password Code."
        });
    }
}
//update email
const change_email = (req, res) => {
    /*
   curl 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary \
'{"idToken":"[FIREBASE_ID_TOKEN]","email":"[user@example2.com]","returnSecureToken":true}'

    */
    if (!req.body.idToken || !req.body.email) {
        res.status(400).send({
            idToken: "idToken is required",
            email: "Email is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${defaultAppConfig.apiKey}`, {
            idToken: req.body.idToken,
            email: req.body.email,
            returnSecureToken: true
        }).then(async (response) => {
            if (response.data) {
                User.findOne({
                    where: {
                        email: req.body.email
                    }
                }).then(async (user) => {
                    if (user) {
                        user.update({
                            email: req.body.email
                        }).then(async (user) => {
                            res.status(200).send({
                                message: "Change Email Successfully!",
                                data: response.data,
                                user: user
                            })
                        }).catch(err => {
                            res.status(500).send({
                                message: err.message || "Some error occurred while updating Email."
                            });
                        }
                        )
                    }
                    else {
                        res.status(400).send({
                            message: "User not found"
                        });
                    }
                })

            }
            else {
                res.status(500).send({
                    message: "Some error occurred while changing Email."
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while changing Email."
            });
        }
        );
    }
    // {
    //     "localId": "tRcfmLH7o2...",
    //     "email": "[user@example2.com]",
    //     "passwordHash": "...",
    //     "providerUserInfo": [
    //       {
    //         "providerId": "password",
    //         "federatedId": "[user@example2.com]"
    //       }
    //     ],
    //     "idToken": "[NEW_ID_TOKEN]",
    //     "refreshToken": "[NEW_REFRESH_TOKEN]",
    //     "expiresIn": "3600"
    //   }
}
//update password
const change_password = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary \
'{"idToken":"[FIREBASE_ID_TOKEN]","password":"[NEW_PASSWORD]","returnSecureToken":true}'
*/

    if (!req.body.idToken || !req.body.password) {
        res.status(400).send({
            idToken: "idToken is required",
            password: "Password is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${defaultAppConfig.apiKey}`, {
            idToken: req.body.idToken,
            password: req.body.password,
            returnSecureToken: true
        }).then(async (response) => {
            if (response.data) {
                User.findOne({
                    where: {
                        uid: req.userId
                    }
                }).then(async (user) => {
                    if (user) {
                        user.update({
                            password: response.data.passwordHash
                        }, {
                            where: {
                                uid: req.userId
                            }
                        })
                            .then(async (user) => {
                                res.status(200).send({
                                    message: "Change Password Successfully!",
                                    data: response.data
                                })
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message: err.message || "Some error occurred while updating Password."
                                })
                            })
                    }
                })


            }
            else {
                res.status(500).send({
                    message: "Some error occurred while changing Password."
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while changing Password."
            });
        }
        );
    }
}
//update profile
const change_profile = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary \
'{"idToken":"[ID_TOKEN]","displayName":"[NAME]","photoUrl":"[URL]","returnSecureToken":true}'
    */
    if (!req.body.idToken || !req.body.displayName || !req.body.photoUrl) {
        res.status(400).send({
            idToken: "idToken is required",
            displayName: "displayName is required",
            photoUrl: "photoUrl is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${defaultAppConfig.apiKey}`, {
            idToken: req.body.idToken,
            displayName: req.body.displayName,
            photoUrl: req.body.photoUrl,
            returnSecureToken: true
        }).then(async (response) => {
            if (response) {
                res.status(200).send({
                    message: "Change Profile Successfully!",
                    data: response.data
                })
            }
            else {
                res.status(500).send({
                    message: "Some error occurred while changing Profile."
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while changing Profile."
            });
        }
        );
    }

}
// gui mail xác nhận địa chỉ email
const sendMailVerification = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary '{"requestType":"VERIFY_EMAIL","idToken":"[FIREBASE_ID_TOKEN]"}'

    */
    if (!req.body.idToken) {
        res.status(400).send({
            idToken: "idToken is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${defaultAppConfig.apiKey}`, {
            requestType: "VERIFY_EMAIL",
            idToken: req.body.idToken
        }).then(async (response) => {
            if (response) {
                res.status(200).send({
                    message: "Send Mail Verification Successfully!",
                    data: response.data
                })
            }
            else {
                res.status(500).send({
                    message: "Some error occurred while sending Mail Verification."
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while sending Mail Verification."
            });
        }
        );
    }

}
// xác nhận địa chỉ email
const cofirmMailVerification = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]' \
-H 'Content-Type: application/json' --data-binary '{"oobCode":"[VERIFICATION_CODE]"}' */
    if (!req.body.oobCode) {
        res.status(400).send({
            oobCode: "oobCode is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${defaultAppConfig.apiKey}`, {
            oobCode: req.body.oobCode
        }).then(async (response) => {
            if (response) {
                res.status(200).send({
                    message: "Confirm Mail Verification Successfully!",
                    data: response.data
                })
            }
            else {
                res.status(500).send({
                    message: "Some error occurred while confirming Mail Verification."
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while confirming Mail Verification."
            });
        }
        );
    }

}
const forgotPassword = (req, res) => {

    if (!req.body.email) {
        res.status(400).send({
            email: "Email is required"
        });
    }
    else {

        firebaseAdmin.generatePasswordResetLink(req.body.email, {
            url: 'http://localhost:3001/signin'
        }).then(link => {
            console.log(link)

            res.status(200).send({
                message: "Send Email Successfully!",
                data: link
            })
        }
        ).catch(err => {
            console.log('Error creating custom token:', err);
            res.status(500).send({
                message: err.message
            });
        })
    }
}
const linkWithEmailAndPassword = (req, res) => {
    /*
    curl 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]' \
    -H 'Content-Type: application/json' \
    --data-binary \
    '{"idToken":"[ID_TOKEN]","email":"[user@example.com]","password":"[PASS]","returnSecureToken":true}' */
    if (!req.body.idToken || !req.body.email || !req.body.password) {
        res.status(400).send({
            idToken: "idToken is required",
            email: "email is required",
            password: "password is required"
        });
    }
    else {
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${defaultAppConfig.apiKey}`, {
            idToken: req.body.idToken,
            email: req.body.email,
            password: req.body.password,
            returnSecureToken: true
        }).then(async (response) => {
            if (response.data) {
                User.update({
                    email: response.data.email,
                    password: response.data.passwordHash,
                }, {
                    where: {
                        uid: response.data.localId
                    }
                }).then(async (result) => {
                    res.status(200).send({
                        message: "Link With Email And Password Successfully!",
                        data: response.data
                    })
                }
                ).catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                })

            }
            else {
                res.status(500).send({
                    message: "Some error occurred while Link With Email And Password."
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while Link With Email And Password."
            });
        }
        );
    }
}

module.exports = {
    signinWithTokenFirebase,
    signinWithEmailPassword,
    signupWithEmailAndPassword,
    revokeRefreshTokens,
    setAdmin, revokeAdmin, checkingAdmin,
    forgotPassword,
    createCustomToken,
    updateUser,
    sendEmailResetPassword,
    checkObbCodeResetPassword,
    verifyResetPassword,
    change_email,
    change_password,
    change_profile,
    sendMailVerification,
    cofirmMailVerification,
    signupWithAmonymous,
    signinWithAmonymous,
    updatePasswordwithAmonymous,
    linkWithEmailAndPassword
}