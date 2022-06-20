const {createUser} = require('../service/user.service')
class UserController {
    //注册
    async register(ctx,text) {
        //获取数据
        const {user_name,password} = ctx.request.body
        //操作数据库
        // const res = await createUser(user_name,password)
        //返回结果
        ctx.body = ctx.request.body
    }

    //登入
    async login(ctx,text) {
        ctx.body = '用户登入成功'
    }
}

//暴露出去一个对象
module.exports = new UserController()