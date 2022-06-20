//第一步导入包
const Router  = require('koa-router')
//引用接口
const {register,login} = require('../controller/user.controller')

//实例化对象
 const router = new Router({prefix:'/users'})
//注册接口
router.post('/register',register)
//登入接口
router.post('/login',login)
//暴露出去
module.exports = router
