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


# 一. 项目的初始化

## 1 npm 初始化

```
npm init -y
```

生成`package.json`文件:

- 记录项目的依赖

## 2 git 初始化

```
git init
```

生成`.git`隐藏文件夹, git 的本地仓库

## 3 创建 ReadMe.md 文件

# 二. 搭建项目

## 1 安装 Koa 框架

```
npm install koa
```

## 2 编写最基本的 app

创建`src/main.js`

```js
//导入Koa包
const Koa = require('koa')
//实例化Koa对象
const app = new Koa()
//中间件
app.use((ctx, next) => {
  ctx.body = 'hello world'
})
//启动服务，监听8888端口
app.listen(3000, () => {
  console.log('server is running on http://localhost:3000')
})
```

## 3 测试

在终端, 使用`node src/main.js`

![image-20210521142016066](http://image.brojie.cn/image-20210521142016066.png)

# 三. 项目的基本优化

## 1 自动重启服务

安装 nodemon 工具

```
来对数据进行监听，当数据发生变化之后，重新启动服务器

npm i nodemon -D

mac上面使用，要使用下面
//npm config set prefix /usr/local
//sudo npm install nodemon -g --registry=https://registry.npm.taobao.org
```

编写`package.json`脚本

```json
"scripts": {
  "dev": "nodemon ./src/main.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

执行`npm run dev`启动服务

![image-20210521142807478](http://image.brojie.cn/image-20210521142807478.png)

## 2 读取配置文件

安装`dotenv`, 读取根目录中的`.env`文件, 将配置写到`process.env`中

```
npm i dotenv
```

创建`.env`文件

```
键必须大写
APP_PORT=8000
```

创建`src/config/config.default.js`

```js
const dotenv = require('dotenv')

dotenv.config()

module.exports = process.env
```

改写`main.js`

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello api'
})

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 3安装[module-alias](https://github.com/ilearnio/module-alias)

```js
npm install module-alias 或 yarn add module-alias 安装 module-alias    作用就是别名
```

配置 `package.json`

```js
"_moduleAliases": {
  "@": "src"
}
```

# 四. 添加路由

路由: 根据不同的 URL, 调用对应处理函数

## 1 安装 koa-router

```
npm i koa-router
```

步骤:

1. 导入包
2. 实例化对象
3. 编写路由
4. 注册中间件

## 2 编写路由

创建`src/router`目录, 编写`user.route.js`

```js
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
  ctx.body = 'hello users'
})

module.exports = router
```

## 3 改写 main.js

```js
const Koa = require('koa')

const { APP_PORT } = require('@/config/config.default')

const userRouter = require('@/router/user.route')

const app = new Koa()

app.use(userRouter.routes())

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

# 五. 目录结构优化

## 1 将 http 服务和 app 业务拆分

创建`src/app/index.js`

```js
const Koa = require('koa')

const userRouter = require('@/router/user.route')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
```

改写`main.js`

```js
const { APP_PORT } = require('@/config/config.default')

const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 2 将路由和控制器拆分

路由: 解析 URL, 分布给控制器对应的方法

控制器: 处理不同的业务

改写`user.route.js`

```js
const Router = require('koa-router')

const { register, login } = require('@/controller/user.controller')

const router = new Router({ prefix: '/users' })

// 注册接口
router.post('/register', register)

// 登录接口
router.post('/login', login)

module.exports = router
```

创建`controller/user.controller.js`

```js
class UserController {
  async register(ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 六. 解析 body

## 1 安装 koa-body

一个功能齐全的[`koa`](https://github.com/koajs/koa)正文解析器中间件。支持`multipart`、`urlencoded`和`json`请求正文。提供与 Express 的 bodyParser 相同的功能 - [`multer`](https://github.com/expressjs/multer)。

```
npm i koa-body
```

## 2 注册中间件

改写`app/index.js`

![image-20220625180651653](https://tva1.sinaimg.cn/large/e6c9d24ely1h3knevltaij20x10ea75x.jpg)

## 3 解析请求数据

改写`user.controller.js`文件

```js
const { createUser } = require('@/service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = ctx.request.body
  }
  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

## 4 拆分 service 层

service 层主要是做数据库处理

创建`src/service/user.service.js`

```js
class UserService {
  async createUser(user_name, password) {
    // todo: 写入数据库
    return '写入数据库成功'
  }
}

module.exports = new UserService()
```

# 七. 集成 [sequlize](https://www.sequelize.com.cn/)

sequelize ORM 数据库工具

ORM: 对象关系映射

- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

## 1 安装 sequelize

```
npm i mysql2 sequelize
```

## 2 连接数据库

创建`src/db/seq.js`

```js
const { Sequelize } = require('sequelize')

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require('@/config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
})
//测试连接数据库是否成功
seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败', err)
  })

module.exports = seq
```

## 3 编写配置文件

```js
APP_PORT = 8888

//数据库的配置
MYSQL_HOST = localhost		//Host
MYSQL_PORT = 3306					//端口号
MYSQL_USER = root					//账号
MYSQL_PWD = root					//密码		
MYSQL_DB = xz							//数据库名称
```

# 八. 创建 User 模型

## 1 拆分 Model 层

sequelize 主要通过 Model 对应数据表

创建`src/model/user.model.js`

```js
const {DataTypes} = require('sequelize')

const seq = require('@/bd/seq')

// 创建模型(Model User -> 表 Users)

const User = seq.define('xz_user',{
     // id 会被sequelize自动创建, 管理
     user_name:{
        type:DataTypes.STRING ,
        allowNull:false,  //表示数据不能为空
        unique:true,        //表示数据是唯一的
        comment:'用户名唯一'
     },
     password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码',
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,        //默认参数
        comment: '是否为管理员, 0: 不是管理员(默认); 1: 是管理员',
      },
})

// 强制同步数据库(创建数据表)  第一次使用
// User.sync({ force: true })
module.exports = User
```

# 九. 添加用户入库

所有数据库的操作都在 Service 层完成, Service 调用 Model 完成数据库操作

改写`src/service/user.service.js`

```js
const User = require('@/model/user.model')

class UserService {
  async createUser(user_name, password) {
    // 插入数据  写入数据库中
    // await表达式: promise对象的值
    const res = await User.create({ user_name, password })
    // console.log(res)

    return res.dataValues
  }
}

module.exports = new UserService()
```

同时, 改写`user.controller.js`

```js
const { createUser } = require('@/service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

# 十. 错误处理

在控制器中, 对不同的错误进行处理, 返回不同的提示错误提示, 提高代码质量

对`user.controller.js`

```js
const { createUser, getUerInfo } = require('@/service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body)
    const { user_name, password } = ctx.request.body

    // 合法性
    if (!user_name || !password) {
      console.error('用户名或密码为空', ctx.request.body)
      ctx.status = 400
      ctx.body = {
        code: '10001',
        message: '用户名或密码为空',
        result: '',
      }
      return
    }
    // 合理性
    if (getUerInfo({ user_name })) {
      ctx.status = 409
      ctx.body = {
        code: '10002',
        message: '用户已经存在',
        result: '',
      }
      return
    }
    // 2. 操作数据库
    const res = await createUser(user_name, password)
    // console.log(res)
    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    }
  }

  async login(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

在 service 中封装函数

```js
const User = require('@/model/user.model.js')

class UserService{
    //创建函数
    async createUSer(user_name,password){
        //写入数据库    表的字段
        const res = await User.create({user_name, password})
        return res.dataValues
    }

    //用户名查询，id查询，管理员查询
    async getUserInfo({id,user_name,password,is_admin}){
        const whereOpt = {}
        //当id存在时
        id && Object.assign(whereOpt,{id})
        user_name && Object.assign(whereOpt,{user_name})
        password && Object.assign(whereOpt,{password})
        is_admin && Object.assign(whereOpt,{is_admin})

        const res = await User.findOne({
            attributes:['id','user_name','password','is_admin'],
            where:whereOpt
        })
        return res ? res.dataValues : null
    }

    }

//暴露出去的是一个对象
module.exports = new UserService()
```

# 十一. 拆分中间件

为了使代码的逻辑更加清晰, 我们可以拆分一个中间件层, 封装多个中间件函数

![image-20210524154353520](http://image.brojie.cn/image-20210524154353520.png)

## 1 拆分中间件

添加`src/middleware/user.middleware.js`

```js
const { getUserInfo } = require('@/service/user.service.js')
const {userFormateError,userAlreadyExited,userRegisterError} = require('@/contant/err.type')
//检测用户注册的信息是否合法
const userValidator = async (ctx,next) => {
    const {user_name,password} = ctx.request.body
    if(!user_name || !password){
        //错误日志
        console.error('用户名或者密码为空',ctx.request.body)
      	//使用ctx.app.emit捕获错误
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
module.exports = {
    userValidator,
    verifyUser
}
```

## 2 统一错误处理

- 在出错的地方使用`ctx.app.emit`提交错误
- 在 app 中通过`app.on`监听

编写统一的错误定义文件

创建`contant/err.type.js`

```js
module.exports = {
    //用户名或密码为空
    userFormateError: {
        code: '10001',
        message: '用户名或密码为空',
        result: '',
    },
    //用户已经存在
    userAlreadyExited: {
        code: '10002',
        message: '用户已经存在',
        result: '',
    },
    //用户注册错误
    userRegisterError: {
        code: '10003',
        message: '用户注册错误',
        result: '',
    },
    //用户不存在
    userDoesNotExist: {
        code: '10004',
        message: '用户不存在',
        result: '',
    },
}
```

## 3 错误处理函数

创建`app/errHandler.js`

```js
//处理错误的状态码
module.exports = (err, ctx) => {
    let status = 500
    switch (err.code) {
        case '10001':
            status = 400
            break
        case '10002':
            status = 409
            break
        default:
            status = 500
    }
    ctx.status = status
    ctx.body = err
    // console.log(err)
}
```

改写`app/index.js`

```js
const errHandler = require('./errHandler')
// 统一的错误处理
app.on('error', errHandler)
```

# 十二. 加密

在将密码保存到数据库之前, 要对密码进行加密处理

123123abc (加盐) 加盐加密

## 1 安装 [bcryptjs](https://www.npmjs.com/package/bcryptjs)

```
npm i bcryptjs
```

## 2 编写加密中间件

`src/middleware/user.middleware.js`

```js
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
```

## 3 在 router 中使用

改写`user.router.js`

```js
//第一步导入包
const Router  = require('koa-router')
//引用验证的中间件
const {userValidator,verifyUser,crpytPassword} = require('@/middleware/user.middleware')

//引用接口
const {register,login} = require('@/controller/user.controller')

//实例化对象
 const router = new Router({prefix:'/users'})
//注册接口 ,先走中间件，后走处理函数
router.post('/register',userValidator,verifyUser,crpytPassword,register)
//登入接口
router.post('/login',login)
//暴露出去
module.exports = router
```

# 十三. 登录验证

流程:

- 验证格式
- 验证用户是否存在
- 验证密码是否匹配

改写`src/middleware/user.middleware.js`

```js
const bcrypt = require('bcryptjs')

const { getUerInfo } = require('../service/user.service')
const {
  userFormateError,
  userAlreadyExited,
  userRegisterError,
  userDoesNotExist,
  userLoginError,
  invalidPassword,
} = require('../constant/err.type')

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.app.emit('error', userFormateError, ctx)
    return
  }

  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  // if (await getUerInfo({ user_name })) {
  //   ctx.app.emit('error', userAlreadyExited, ctx)
  //   return
  // }
  try {
    const res = await getUerInfo({ user_name })

    if (res) {
      console.error('用户名已经存在', { user_name })
      ctx.app.emit('error', userAlreadyExited, ctx)
      return
    }
  } catch (err) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }

  await next()
}

const crpytPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  const salt = bcrypt.genSaltSync(10)
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt)

  ctx.request.body.password = hash

  await next()
}

const verifyLogin = async (ctx, next) => {
  // 1. 判断用户是否存在(不存在:报错)
  const { user_name, password } = ctx.request.body

  try {
    const res = await getUerInfo({ user_name })

    if (!res) {
      console.error('用户名不存在', { user_name })
      ctx.app.emit('error', userDoesNotExist, ctx)
      return
    }

    // 2. 密码是否匹配(不匹配: 报错)
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit('error', invalidPassword, ctx)
      return
    }
  } catch (err) {
    console.error(err)
    return ctx.app.emit('error', userLoginError, ctx)
  }

  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  crpytPassword,
  verifyLogin,
}
```

定义错误类型

```js
module.exports = {
  userFormateError: {
    code: '10001',
    message: '用户名或密码为空',
    result: '',
  },
  userAlreadyExited: {
    code: '10002',
    message: '用户已经存在',
    result: '',
  },
  userRegisterError: {
    code: '10003',
    message: '用户注册错误',
    result: '',
  },
  userDoesNotExist: {
    code: '10004',
    message: '用户不存在',
    result: '',
  },
  userLoginError: {
    code: '10005',
    message: '用户登录失败',
    result: '',
  },
  invalidPassword: {
    code: '10006',
    message: '密码不匹配',
    result: '',
  },
}
```

改写路由

```js
// 登录接口
router.post('/login', userValidator, verifyLogin, login)
```

# 十四. 用户的认证

登录成功后, 给用户颁发一个令牌 token, 用户在以后的每一次请求中携带这个令牌.

jwt: jsonwebtoken

- header: 头部
- payload: 载荷
- signature: 签名

## 1 颁发 token

### 1) 安装 jsonwebtoken

```
npm i jsonwebtoken
```

### 2) 在控制器中改写 login 方法

```js
async login(ctx, next) {
  const { user_name } = ctx.request.body

  // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
  try {
    // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
    const { password, ...res } = await getUerInfo({ user_name })

    ctx.body = {
      code: 0,
      message: '用户登录成功',
      result: {
        token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
      },
    }
  } catch (err) {
    console.error('用户登录失败', err)
  }
}
```

### 3) 定义私钥

在`.env`定义

```
JWT_SECRET = xzd
```

## 2 用户认证

### 1) 创建 auth 中间件

创建`auth.middleware.js`

```js
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config/config.default')

const { tokenExpiredError, invalidToken } = require('../constant/err.type')

const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  console.log(token)

  try {
    // user中包含了payload的信息(id, user_name, is_admin)
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err)
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效的token', err)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }

  await next()
}

module.exports = {
  auth,
}
```

### 2) 改写 router

![image-20220626012017339](https://tva1.sinaimg.cn/large/e6c9d24ely1h3kzxrtla9j211i0lg41p.jpg)

### 3.修改密码

![iShot_2022-06-26_01.39.28](https://tva1.sinaimg.cn/large/e6c9d24ely1h3l0hufpp1j20u01f8tdx.jpg)

### 4.修改数据库

`user.service.js`

```js
//修改数据库中的密码
    async updateById({ id, user_name, password, is_admin }) {
        const whereOpt = { id }
        const newUser = {}

        user_name && Object.assign(newUser, { user_name })
        password && Object.assign(newUser, { password })
        is_admin && Object.assign(newUser, { is_admin })
        //更新字段
        const res = await User.update(newUser, { where: whereOpt })
        return res[0] > 0 ? true : false
    }
```

### 5.错误信息

`contant/err.type.js`

```js
//修改密码失败
    ChangePasswordFailureText_Description: {
        code: '10007',
        message: '修改密码失败',
        result: '',
    },
    //token已过期
    tokenExpiredError: {
        code: '10101',
        message: 'token已过期',
        result: '',
    },
    //无效的token
    invalidToken: {
        code: '10102',
        message: '无效的token',
        result: '',
    },
```







