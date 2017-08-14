const Router = require('../../src').Router;

const router = new Router({
  prefix: '/api'
});

router.get('/', ctx => ctx.Controller.user.a());
router.get('/b', ctx => ctx.Controller.user.b());

router.mount('/users', ctx => ctx.Controller.user);

module.exports = router;
