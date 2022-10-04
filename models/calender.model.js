const Calender = (sequelize, Sequelize) => {
    const Calender = sequelize.define("calender", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1,
            allowNull: false,
        },
        DayOftheweek: {
            //Ngày trong tuần
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        sessionDay: {
            //buổi (sáng chiều tối)
            type: Sequelize.TIME,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        available: {
            //Có thể đăng ký hay không
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        capacity: {
            //Số lượng học sinh tối đa
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 30
        }

    });
    return Calender;
}
module.exports = { Calender };