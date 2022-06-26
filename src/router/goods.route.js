//引用接口
const Router = require("koa-router")

const { auth, hadAdminPermission } = require('@/middleware/auth.middleware')
const { upload } = require('@/controller/goods.controller')
//实例化对象
const router = new Router({ prefix: '/goods' })

// 商品图片上传接口
router.post('/upload', auth, hadAdminPermission, upload)

//暴露出去
module.exports = router