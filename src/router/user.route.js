//第一步导入包
const Router  = require('koa-router')
//实例化对象
 const router = new Router({prefix:'/users'})
//编写路由 GET /users/
router.get('/',(ctx,next) => {
    ctx.body = 'hello users'
})
//暴露出去
module.exports = router
