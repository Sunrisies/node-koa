require('module-alias/register')


//引用读取配置文件
const { APP_PORT } = require('@/config/config.default')
const app = require('@/app')
//启动服务，监听8888端口
app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})

//安装插件 nodemon 来对数据进行监听，当数据发生变化之后，重新启动服务器，mac上面使用，要使用下面
//npm config set prefix /usr/local
//sudo npm install nodemon -g --registry=https://registry.npm.taobao.org
