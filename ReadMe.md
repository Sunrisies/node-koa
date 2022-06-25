//安装插件 nodemon 来对数据进行监听，当数据发生变化之后，重新启动服务器mac上面使用，要使用下面
//npm config set prefix /usr/local
//sudo npm install nodemon -g --registry=https://registry.npm.taobao.org
```js
app  业务处理的主入口文件
    index.js   基本配置
    errHandler.js   错误统一处理
bd   是负责连接数据库的
    seq.js  负责连接数据库
config  是对.env进行全局配置
    config.default.js    .env基本配置
contant
    err.type    所有的错误处理
controller  是负责处理路由里面的函数
    user.controller.js   负责处理用户相关的函数
middleware
    user.middleware.js   中间件，对用户的登入，注册进行验证，和错误提示
model   是数据库里面的数据模型
    user.model.js   用户的模型
router 是路由
    user.route.js    关于用户的路由信息
service         接收数据传到数据库里面
    user.service.js   关于用户的数据库操作

idnex.js    服务器的入口文件
```






