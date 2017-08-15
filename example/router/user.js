const Router = require('../../src').Router;

const router = new Router({
  prefix: '/api'
});

router.get('/', ctx => ctx.controller.user.a());
router.get('/b', ctx => ctx.controller.user.b());

router.mount('/users', ctx => ctx.controller.user);

module.exports = router;
