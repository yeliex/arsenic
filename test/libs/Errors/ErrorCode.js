const { should } = require('chai');
const ErrorCode = require('../../../lib/libs/Errors/ErrorCode');

should();

describe('ErrorCode', () => {
  let error;

  it('create success', () => {
    error = new ErrorCode(100, '未知错误');
    console.log(error.code);
  });
});
