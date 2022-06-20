//导入Koa包
const Koa = require('koa')
//导入koa-body，作用就是解析数据
//一个功能齐全的koa正文解析器中间件。支持multipart、urlencoded和json请求正文。提供与 Express 的 bodyParser 相同的功能 - multer。
const KoaBody = require('koa-body')



//实例化Koa对象
const app = new Koa()
//要在路由之前使用
app.use(KoaBody())

//引用koa-router
const userRouter = require('../router/user.route')


//编写中间件
app.use(userRouter.routes())

module.exports = app