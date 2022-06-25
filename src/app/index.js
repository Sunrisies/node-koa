//导入Koa包
const Koa = require('koa')
//导入koa-body，作用就是解析数据
const KoaBody = require('koa-body')

//错误处理
const errHandler = require('./errHandler')

//实例化Koa对象
const app = new Koa()
//要在路由之前使用
app.use(KoaBody())

//引用koa-router
const userRouter = require('@/router/user.route')

//编写路由
app.use(userRouter.routes())

// 统一的错误处理
app.on('error', errHandler)

module.exports = app