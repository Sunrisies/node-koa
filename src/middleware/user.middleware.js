const bcrypt = require('bcryptjs')
const { getUserInfo } = require('@/service/user.service.js')
const {userFormateError,userAlreadyExited,userRegisterError} = require('@/contant/err.type')
//检测用户注册的信息是否合法
const userValidator = async (ctx,next) => {
    const {user_name,password} = ctx.request.body
    if(!user_name || !password){
        //错误日志
        console.error('用户名或者密码为空',ctx.request.body)
        ctx.app.emit('error',userFormateError,ctx)
        return
    }
    await next()
}

//检测用户名是否存在
const verifyUser = async (ctx,next) => {
    const { user_name } = ctx.request.body
    try{
        const res = await getUserInfo({ user_name })
        if(res) {
            console.error('用户名已存在',{user_name})
            ctx.app.emit('error',userAlreadyExited,ctx)
            return
        }
    }catch (err){
        console.error('获取用户信息错误', err)
        ctx.app.emit('error', userRegisterError, ctx)
        return
    }
    await next()
}

//密码加密
const crpytPassword = async (ctx,next) => {
    //先获取明文密码
    const {password} = ctx.request.body
    const salt = bcrypt.genSaltSync(10)
    // hash保存的是 密文
    const hash = bcrypt.hashSync(password, salt)
    //把修改原来的明文为密文
    ctx.request.body.password = hash
    await next()
}
module.exports = {
    userValidator,
    verifyUser,
    crpytPassword
}

