class UserService{
    async createUSer(user_name,password){
        //写入数据库
        console.log(user_name,password)
        return '写入数据库成功'
    }
    }

//暴露出去的是一个对象
module.exports = new UserService()