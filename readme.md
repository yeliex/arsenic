# Arsenic

[![Greenkeeper badge](https://badges.greenkeeper.io/yeliex/arsenic.svg?token=de4133fae9b8a3932a1b25d99d0a378c1334a29bf38eb0dd46cbc9a3570e1c1b&ts=1526967498624)](https://greenkeeper.io/)

- structure
  ```
  Arsenic Project
  ├── config
  |   ├── config.default.js
  |   ├── config.daily.js
  |   └── config.online.js
  ├── controller
  |   └── user
  |      └── index.js
  ├── service
  |   └── user
  |      └── index.js
  ├── router
  |   └── user.js
  ├── lib
  ├── test
  ├── index.js
  └── package.json
  ```

- router
  
  Router 主要用来描述请求 URL 和具体承担执行动作的 Controller 的对应关系
  ```ecmascript 6
  // router/user.js
  const router = require("arsenic").router();
  
  router.mount('/user', ctx => ctx.controller.user );
    // ctx.get('/users', ctx => ctx.controller.user.list);
    // ctx.post('/users', ctx => ctx.controller.user.create);
    // ctx.get('/users/:id', ctx => ctx.controller.user.item);
    // ctx.put('/users/:id', ctx => ctx.controller.user.update);
    // ctx.delete('/users/:id', ctx => ctx.controller.user.destroy);

  router.get('/users',ctx => ctx.controller.user.list);
  
  router.post('/users',ctx => ctx.controller.user.list);
  
  module.exports = router;
  ```

- controller

  Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中

  框架推荐 Controller 层主要对用户的请求参数进行处理（校验、转换），然后调用对应的 service 方法处理业务，得到业务结果后封装并返回
  - 获取用户通过 HTTP 传递过来的请求参数
  - 校验、组装参数
  - 调用 Service 进行业务处理，必要时处理转换 Service 的返回结果，让它适应用户的需求
  - 通过 HTTP 将结果响应给用户
  
  ```ecmascript 6
  // controller/user/index.js
  const Context = require('arsenic').Context;
  
  class UserController extends Context {
    list() {
      return this.Service.user.getUserList();
    }
    create(){
      return this.Service.user.getUser({phone: this._POST.phone}).then((user)=>{
        if(user){
          return Promise.reject('user exist');
        }
        return this.Service.user.addUser(this._POST);
      });
    }
    destroy(){
      return this.Service.user.getUser({phone: this._POST.phone}).then((user)=>{
        if(user){
          return Promise.reject('user exist');
        }
        return this.Service.user.deleteUser({id: this._POST.id});
      });
    }
  }
  
  module.exports = UserController;
  ```

- service
  
  Service 是在复杂业务场景下用于做业务逻辑封装的一个抽象层
  - 保持 Controller 中的逻辑更加简洁
  - 保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用
  - 将逻辑和展现分离，更容易编写测试用例
  - 复杂数据的处理
  - 第三方服务的调用
  
  ```ecmascript 6
  // service/user/index.js
  const Context = require('arsenic').Context;
  
  class UserService extends Context {
    getUserList(){
      return this.db.userDB.findAll();
    }
  }

  // OR
  const {userDB} = require('../../libs/db');

  exports.getUserList = () => {
    return userDB.findAll();
  }
  ```
