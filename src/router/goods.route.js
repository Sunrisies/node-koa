//引用接口
const Router = require("koa-router");

const {upload} = require('@/controller/goods.controller')
//实例化对象
const router = new Router({prefix:'/goods'})

// 商品图片上传接口
router.post('/upload',upload)

//暴露出去
module.exports = router