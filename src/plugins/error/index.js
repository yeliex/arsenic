/**
 * 错误处理
 * @file index
 * @author: yeliex
 * @create: 2017/8/23 下午2:38
 */
const { Error } = require('@bee/foundation');
const { resolve } = require('path');

module.exports = (App) => {
  App.Error = Error;

  // 读取错误配置文件设置
  App.Errors = require(resolve(App.config.cwd, './config/errors.define.js'));

  Object.keys(Error.Errors).forEach((k) => {
    if(App.Errors[k]){
      throw new Error(`Duplicate error: ${k}, do not redefine reserved error`);
    }
    App.Errors[k] = Error.Errors[k];
  });
};
