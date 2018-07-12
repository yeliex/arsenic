/**
 * 错误系列
 * @file SeriesTypes
 * @author yeliex
 * @create 2017/8/23 下午2:18
 */

const SeriesType = require('./SeriesType');

exports.COMMON = new SeriesType('000', '通用');
exports.CHOPIN = new SeriesType('001', '内容检测');

exports.USER = new SeriesType('101', '用户');
