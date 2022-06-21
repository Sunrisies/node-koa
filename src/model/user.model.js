const {DataTypes} = require('sequelize')

const seq = require('../bd/seq')

// 创建模型(Model xz_user -> 表 xz_users)

const User = seq.define('xz_user',{
     // id 会被sequelize自动创建, 管理
     user_name:{
        type:DataTypes.STRING ,
        allowNull:false,  //表示数据不能为空
        unique:true,        //表示数据是唯一的
        comment:'用户名唯一'
     },
     password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码',
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,        //默认参数
        comment: '是否为管理员, 0: 不是管理员(默认); 1: 是管理员',
      },
})

// 强制同步数据库(创建数据表)
User.sync({ force: true })



module.exports = User
