require('module-alias/register')

//引用读取配置文件
const { APP_PORT } = require('@/config/config.default')
const app = require('@/app')
//启动服务，监听8888端口
app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})

