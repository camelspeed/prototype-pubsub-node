import * as express from 'express';
const indexRouter = express.Router();

/**
 * GET /
 */
indexRouter.get('/', function(req, res, next) {
  res.send({title: 'System Up'});
});

export { indexRouter };
