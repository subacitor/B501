const Reg_Calender = (sequelize, Sequelize) => {
    const Reg_Calender = sequelize.define("reg_calender", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1,
            allowNull: false,
        },
        full_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        soLuongTv: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        time_Reg: {
            type: Sequelize.TIME,
            allowNull: false,
           defaultValue: Sequelize.NOW
        },
        day_Reg: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        }
        ,
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        //type : 1: ĐANG CHỜ XỬ LÝ, 2: Đã xét duyệt,3 từ chối,4 đã hủy

        status_active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        timestamps: false,
    }
    );
    return Reg_Calender;
}
module.exports = { Reg_Calender };