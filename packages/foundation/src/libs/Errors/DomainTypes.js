/**
 * 错误领域(系统/业务)
 * @file DomainTypes
 * @author: yeliex
 * @create: 2017/8/23 下午2:41
 */

const DomainType = require('./DomainType');

exports.S = DomainType.System = new DomainType('S');

exports.B = DomainType.Business = new DomainType('B');
