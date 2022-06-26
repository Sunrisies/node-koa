const { createUSer, getUserInfo, updateById } = require('@/service/user.service')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('@/config/config.default')
//错误
const { userRegisterError, ChangePasswordFailureText_Description } = require('@/contant/err.type')

class UserController {
    //注册
    async register(ctx, text) {
        //1.获取数据
        const { user_name, password } = ctx.request.body
        //2.操作数据库
        try {
            const res = await createUSer(user_name, password)
            //3.返回结果
            ctx.body = {
                code: 0,
                message: '用户注册成功',
                result: {
                    id: res.id,
                    user_name: res.user_name,
                }
            }
        } catch (err) {
            // 用户注册错误
            console.log(err)
            ctx.app.emit('error', userRegisterError, ctx)
        }
    }
    //登入
    async login(ctx, text) {
        const { user_name } = ctx.request.body
        // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
        try {
            // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
            const { password, ...res } = await getUserInfo({ user_name })
            ctx.body = {
                code: 0,
                message: '用户登录成功',
                result: {
                    //res表示用户信息，JWT_SECRET表示用户的密钥，expiresIn过期时间
                    token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
                },
            }
        } catch (err) {
            console.error('用户登录失败', err)
        }
    }
    //修改密码
    async changePassword(ctx, next) {
        // 1. 获取数据
        const id = ctx.state.user.id
        const password = ctx.request.body.password

        // 2. 操作数据库
        try {
            const res = await updateById({ id, password })
            if (res) {
                ctx.body = {
                    code: 0,
                    message: '修改密码成功',
                    result: '',
                }
                return
            }
        } catch (err) {
            console.error('修改密码失败', err)
            return ctx.app.emit('error', ChangePasswordFailureText_Description, ctx)
        }
        // 3. 返回结果
    }
}
//暴露出去一个对象
module.exports = new UserController()