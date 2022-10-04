const { db } = require('../models/index');
const Op = db.Sequelize.Op;
const Calender = db.calender;
const User = db.user;

const create_Calender = (req, res) => {
    try {
        Calender.create({
            DayOftheweek: req.body.DayOftheweek,
            sessionDay: req.body.sessionDay,
            available: req.body.available,
            capacity: req.body.capacity,
        }).then((calender) => {
            res.status(200).send(calender);
        }
        ).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Calender."
            });
        }
        );
    } catch (error) {
        console.log(error);
    }
}
const get_Calender = (req, res) => {
    try {
        Calender.findAll().then(calender => {
            res.status(200).send(calender);
        }
        ).catch(err => {
            res.status(500).send({
                message: err.message || "Can't find Calender."
            });
        }
        );
    } catch (error) {
        res.send(error);
    }
}
const get_Calender_by_id = (req, res) => {
    Calender.findOne({
        where: {
            id: req.params.id
        }
    }).then((calender) => {
        res.send(calender);
    }
    ).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Calender."
        });
    })
}
const update_Calender = (req, res) => {
    Calender.update(
        {
            DayOftheweek: req.body.DayOftheweek,
            sessionDay: req.body.sessionDay,
            available: req.body.available,
            capacity: req.body.capacity,
        }
        , {
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.send({
                message: "Calender was updated successfully."
            });
        }
        ).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating Calender."
            });
        }
        );

}
const delete_Calender = (req, res) => {
    Calender.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.send({
            message: "Calender was deleted successfully."
        });
    }
    ).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting Calender."
        });
    }
    );
}
module.exports = { create_Calender, get_Calender, get_Calender_by_id, update_Calender, delete_Calender };