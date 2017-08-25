/**
 *
 * @file index
 * @author: yeliex
 * @create: 2017/8/25 上午10:27
 */
const assert = require('assert');
const { promisify } = require('util');

exports.promisify = (object) => {
  assert(['function', 'object'].includes(typeof object));

  if (typeof object === 'function') {
    return promisify(object);
  }

  Object.keys(object).forEach((k) => {
    object[k] = exports.promisify(object[k]);
  });

  return object;
};

exports.promisifyAll = exports.promisify;
