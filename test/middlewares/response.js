const { should } = require('chai');
const middleware = require('../../src/middlewares/response');
const { STATUS_CODES } = require('http');

should();

class Context {
  constructor(ctx = {}) {
    ctx.headers = Object.keys(ctx.headers || {}).reduce((total, k) => {
      total[k.toLowerCase()] = ctx.headers[k];
      return totall;
    }, {});
    this.ctx = ctx;
  }

  get status() {
    return this.ctx.status;
  }

  set status(code) {
    this.ctx.status = code;
  }

  get statusText() {
    return STATUS_CODES[this.ctx.status];
  }

  get body() {
    return this.ctx.body;
  }

  set body(data) {
    this.ctx.body = data;
  }

  get(key) {
    return this.ctx.headers[key.toLowerCase()];
  }

  set(key, value) {
    this.ctx.headers[key.toLowerCase()] = value;
  }
}

const pairs = [
  {
    input: [],
    output: [404, STATUS_CODES[404], [404, '', STATUS_CODES[404]]]
  },
  {
    input: [403],
    output: [403, STATUS_CODES[403], [403, '', STATUS_CODES[403]]]
  },
  {
    input: [new Error('invalid')],
    output: [500, STATUS_CODES[500], [500, '', 'invalid']]
  },
  {
    input: ['something exploded'],
    output: [500, STATUS_CODES[500], [500, '', 'something exploded']]
  },
  {
    input: [{ code: 200, data: 'success' }],
    output: [200, STATUS_CODES[200], [200, 'success', '']]
  },
  {
    input: [{ code: 200, data: 'success', message: 'ok' }],
    output: [200, STATUS_CODES[200], [200, 'success', 'ok']]
  },
  {
    input: [400, 'name required'],
    output: [400, STATUS_CODES[400], [400, '', 'name required']]
  },
  {
    input: ['name required', 400],
    output: [400, STATUS_CODES[400], [400, '', 'name required']]
  },
  {
    input: [400, new Error('invalid')],
    output: [400, STATUS_CODES[400], [400, '', 'invalid']]
  },
  {
    input: [new Error('invalid'), 400],
    output: [400, STATUS_CODES[400], [400, '', 'invalid']]
  },
  {
    input: [200, [{ userId: 1 }]],
    output: [200, STATUS_CODES[200], [200, [{ userId: 1 }]], '']
  },
  {
    input: [[{ userId: 1 }], 200],
    output: [200, STATUS_CODES[200], [200, [{ userId: 1 }]], '']
  }
];

describe('middleware-response', () => {
  pairs.forEach(({ input, output }) => {
    input = input instanceof Array ? input : [input];

    const call = `ctx.throw(${input.map((a) => typeof a === 'object' ? JSON.stringify(a) : a).join(', ')})`;
    const body = JSON.stringify({
      code: output[2][0],
      data: output[2][1] || '',
      message: output[2][2] || ''
    });

    it(`${call} ... ${output[0]} ${output[1]} ${body}`, () => {
      const ctx = new Context();

      middleware()(ctx, async () => {
      });

      ctx.throw(...input);

      ctx.status.should.equal(output[0]);
      ctx.statusText.should.equal(output[1]);
      ctx.body.should.equal(body);
    });
  });
});
