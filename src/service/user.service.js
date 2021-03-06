const User = require('@/model/user.model.js')
class UserService {
    //创建数据表
    async createUSer(user_name, password) {
        //写入数据库    表的字段
        const res = await User.create({ user_name, password })
        return res.dataValues
    }

    //用户名查询，id查询，管理员查询
    async getUserInfo({ id, user_name, password, is_admin }) {
        const whereOpt = {}
        //当id存在时
        id && Object.assign(whereOpt, { id })
        user_name && Object.assign(whereOpt, { user_name })
        password && Object.assign(whereOpt, { password })
        is_admin && Object.assign(whereOpt, { is_admin })

        const res = await User.findOne({
            attributes: ['id', 'user_name', 'password', 'is_admin'],
            where: whereOpt
        })
        return res ? res.dataValues : null
    }

    //修改数据库中的密码
    async updateById({ id, user_name, password, is_admin }) {
        const whereOpt = { id }
        const newUser = {}

        user_name && Object.assign(newUser, { user_name })
        password && Object.assign(newUser, { password })
        is_admin && Object.assign(newUser, { is_admin })
        //更新字段
        const res = await User.update(newUser, { where: whereOpt })
        return res[0] > 0 ? true : false
    }
}

//暴露出去的是一个对象
module.exports = new UserService()