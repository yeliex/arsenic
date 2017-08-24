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
exports.INFORMATION = new SeriesType('102', '资讯');
exports.SPORT = new SeriesType('103', '运动');
exports.SNS = new SeriesType('104', 'SNS');
exports.COMMODITY = new SeriesType('105', '商品');
exports.TRADE = new SeriesType('106', '交易');
exports.RESOURCE = new SeriesType('107', '资源');
exports.ECHO = new SeriesType('108', 'echo');
exports.MESSAGE = new SeriesType('109', '消息');
exports.ACHIEVEMENT = new SeriesType('110', '成就');
exports.GAME = new SeriesType('111', '玩法');
exports.PROMOTION = new SeriesType('112', '营销');
exports.GROUPS = new SeriesType('113', '群组');
exports.CHOPIN = new SeriesType('114', '内容检测');
exports.DELIVERY = new SeriesType('115', '物流');
exports.PAYMENT = new SeriesType('116', '支付');
exports.COUPON = new SeriesType('117', '优惠券');
exports.CLASSIFY = new SeriesType('118', '品类');
exports.TAG = new SeriesType('119', '标签');
exports.ORGANIZATION = new SeriesType('120', '组织');
exports.NOTIFY = new SeriesType('121', '通知');

exports.NODE_MESSAGE = new SeriesType('1001', '消息');
