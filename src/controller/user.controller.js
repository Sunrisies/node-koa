const {createUSer} = require('@/service/user.service')

//错误
const { userRegisterError } = require('@/contant/err.type')

class UserController {
    //注册
    async register(ctx,text) {
        //1.获取数据
        const {user_name,password} = ctx.request.body
        //2.操作数据库
        try{
            const res = await createUSer(user_name,password)
            //3.返回结果
            ctx.body = {
                code:0,
                message:'用户注册成功',
                result:{
                    id:res.id,
                    user_name:res.user_name,
                }
            }
        }catch (err){
            // 用户注册错误
            console.log(err)
            ctx.app.emit('error', userRegisterError, ctx)
        }
    }

    //登入
    async login(ctx,text) {
        ctx.body = '用户登入成功'
    }
}

//暴露出去一个对象
module.exports = new UserController()