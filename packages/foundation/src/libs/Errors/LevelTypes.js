/**
 * 错误的等级,部分错误只是警告,可以作为判断是否失败的依据
 * @file LevelType
 * @author yeliex
 * @create 2017/8/23 下午2:18
 */
const LevelType = require('./LevelType');

exports.INFO = new LevelType(2);

exports.WARNING = new LevelType(1);

exports.ERROR = new LevelType(0);
