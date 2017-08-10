const router = require('koa-router')();

router.get('/', async (ctx) => {
  ctx.controller.test.xxx();
});

module.exports = router;
