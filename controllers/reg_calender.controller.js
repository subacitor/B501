const { db } = require('../models/index');
const Op = db.Sequelize.Op;
const Calender = db.calender;
const Reg_Calender = db.reg_calender;
const User = db.user;
//xác nhận đăng kí lịch
const accpet_Reg_Calender = (req, res) => {
    Reg_Calender.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result) {
            Reg_Calender.update({
                isActive: true,
                status_active: 2
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).json({
                    message: "Reg_Calender was updated successfully"
                });
            }).catch((err) => {
                res.status(500).json({
                    message: "Error updating Reg_Calender",
                    error: err
                });
            })
        }
        else {
            res.status(400).send({
                message: "Không tồn tại lịch đăng kí này ."
            });
        }
    })

}
//đăng kí lịch
const create_reg_calender = (req, res) => {
    try {
        Calender.findOne({
            where: {
                id: req.params.calender_id
            }
        }).then(result => {
            if (result) {
                Reg_Calender.findOne({
                    where: {
                        calender_id: req.params.calender_id,
                        user_id: req.userId
                    }
                }).then(result => {
                    if (result) {
                        res.status(400).send({
                            message: "Bạn đã đăng kí lịch này rồi"
                        });
                    }
                    else {
                        Reg_Calender.create({
                            calender_id: req.params.calender_id,
                            full_name: req.body.full_name,
                            soLuongTv: req.body.soLuongTv,
                            description: req.body.description,
                            time_Reg: req.body.time_Reg,
                            day_Reg: req.body.day_Reg,
                        }).then((reg_calender) => {
                            reg_calender.setUser(req.userId);
                            reg_calender.setCalender(req.params.calender_id);
                            res.status(201).json({
                                message: "Reg_Calender was created successfully",
                                reg_calender: reg_calender
                            });
                        }).catch((err) => {
                            res.status(500).json({
                                message: "Error creating Reg_Calender",
                                error: err.message
                            });
                        }
                        );
                    }
                })
            }
            else {
                res.status(400).send({
                    message: "Calender id was not found."
                });
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message
            });
        })

    } catch (error) {
        res.status(500).send({
            message: "Error creating calender",
            error: error
        });
    }


}
//xử lí trạng thái đăng kí lịch
const status_reg_calender = (req, res) => {
    Reg_Calender.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result) {
            //type : 1: ĐANG CHỜ XỬ LÝ, 2: Đã xét duyệt,3 từ chối,4 đã hủy
            Reg_Calender.update({
                //if status_active = 1: ĐANG CHỜ XỬ LÝ isActive = false
                //if status_active = 2: Đã xét duyệt thì isActive = true
                //if status_active = 3: Từ chối thì isActive = false
                //if status_active = 4: Đã hủy thì isActive = false
                isActive: req.body.status_active == 1 ? false : req.body.status_active == 2 ? true : req.body.status_active == 3 ? false : false,
                status_active: req.body.status_active
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).json({
                    message: "Reg_Calender was updated successfully"
                });
            }).catch((err) => {
                res.status(500).json({
                    message: "Error updating Reg_Calender",
                    error: err
                });
            }
            );
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message
        });
    })
}
//user thay đổi thông tin đăng kí lịch
const update_reg_calender = (req, res) => {
    Reg_Calender.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result) {
            Reg_Calender.update({
                full_name: req.body.full_name,
                soLuongTv: req.body.soLuongTv,
                description: req.body.description,
                time_Reg: req.body.time_Reg,
                day_Reg: req.body.day_Reg,
                 status_active: req.body.status_active//4: Đã hủy
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).json({
                    message: "Reg_Calender was updated successfully"
                });
            }).catch((err) => {
                res.status(500).json({
                    message: "Error updating Reg_Calender",
                    error: err
                });
            }
            );
        }
        else {
            res.status(400).send({
                message: "Không tồn tại lịch đăng kí này ."
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message
        });
    }
    );
}
//xóa record đăng kí lịch
const delete_reg_calender = (req, res) => {
    Reg_Calender.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result) {
            Reg_Calender.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {

                res.status(200).json({
                    message: "Reg_Calender was deleted successfully"
                });
            }
            ).catch((err) => {
                res.status(500).json({
                    message: "Error deleting Reg_Calender",
                    error: err
                });
            }
            );
        }
        else {
            res.status(400).send({
                message: "Không tồn tại lịch đăng kí này ."
            });
        }
    }
    ).catch((err) => {
        res.status(500).send({
            message: err.message

        });
    })
}
//lấy ra tất cả những user đăng kí
const get_reg_calender = (req, res) => {
    //lấy ra toàn bộ những user đã đăng kí lịch
    Reg_Calender.findAll({
        include: [{
            model: Calender,
            attributes: ['id', 'DayOftheweek', 'SessionDay', 'available', 'capacity']
        }, {
            model: User,
            attributes: ['uid', 'displayName', 'email', 'phoneNumber', 'photoURL',]
        }]

    }).then(reg_calender => {
        if (reg_calender) {
            res.send(reg_calender);

            //    const user_Calen= Object.assign({}, reg_calender);

            //    res.status(200).json({
            //         user_Calen: user_Calen
            //     });

        }
        else {
            res.status(400).send({
                message: "Reg_Calender was not found ."
            });
        }
    }
    ).catch(err => {
        res.status(500).send({
            message: err.message
        });
    })
    //đếm số lượng user trong bảng reg_calender
}
//lấy ra tất cả những user đăng kí và được duyệt
const get_reg_calender_active = (req, res) => {
    //lấy ra toàn bộ những user đã đăng kí lịch
    Reg_Calender.findAll({
        include: [{
            model: Calender,
            attributes: ['id', 'DayOftheweek', 'SessionDay', 'available', 'capacity']
        }, {
            model: User,
            attributes: ['uid', 'displayName', 'email', 'phoneNumber', 'photoURL',]
        }],
        where: {
            isActive: true
        }
    }).then(reg_calender => {
        if (reg_calender) {
            res.send(reg_calender);

        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    }
    )
}
const change_status_user = (req, res) => {
    Reg_Calender.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result) {
            Reg_Calender.update({
                status_active: req.body.status_active
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).json({
                    message: "Reg_Calender was updated successfully"
                });
            }).catch((err) => {
                res.status(500).json({
                    message: "Error updating Reg_Calender",
                    error: err
                });
            }
            );
        }
        else {
            res.status(400).send({
                message: "Không tồn tại lịch đăng kí này ."
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message
        });
    }
    );
}
const delete_reg_calender_user = (req, res) => {
    Reg_Calender.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result) {
            Reg_Calender.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {

                res.status(200).json({
                    message: "Reg_Calender was deleted successfully"
                });
            }
            ).catch((err) => {
                res.status(500).json({
                    message: "Error deleting Reg_Calender",
                    error: err
                });
            }
            );
        }
        else {
            res.status(400).send({
                message: "Không tồn tại lịch đăng kí này ."
            });
        }
    }
    ).catch((err) => {
        res.status(500).send({
            message: err.message
        })
    }
    );
}
module.exports = {
    create_reg_calender,
    get_reg_calender,
    get_reg_calender_active,
    accpet_Reg_Calender,
    status_reg_calender,
    update_reg_calender,
    delete_reg_calender,
    change_status_user,
    delete_reg_calender_user,
}