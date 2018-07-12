/**
 *
 * @file ErrorCodes
 * @author: yeliex
 * @create: 2017/8/24 上午11:17
 */

const ErrorCode = require('./ErrorCode');

exports.UNKNOWN_CODE = new ErrorCode(1, '未知错误');
exports.SYSTEM_ERROR_CODE = new ErrorCode(2, '系统异常.');
exports.ILLEGAL_PARAM_CODE = new ErrorCode(3, '参数错误.');
exports.ENTITY_NOT_EXIST_CODE = new ErrorCode(4, '数据不存在.');
exports.USER_NOT_EXIST_CODE = new ErrorCode(5, '用户不存在.');
exports.PERMISSION_ERROR_CODE = new ErrorCode(6, '权限错误.');
exports.PAGED_NO_MORE_DATA_CODE = new ErrorCode(7, '没有更多的数据.');
