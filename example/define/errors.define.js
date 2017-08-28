/**
 *
 * @file errors.define
 * @author: yeliex
 * @create: 2017/8/24 下午6:14
 */
const { Error } = require('@bee/foundation');

const Template = new Error.ErrorTemplate(Error.SeriesTypes.NODE_MESSAGE);

exports.TEST_ERROR = new Template(1000,'商家不存在');
