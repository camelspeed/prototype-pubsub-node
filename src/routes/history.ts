import { historyService } from '../services/subscribers/historyService';
import { History } from '../services/model';
import * as express from 'express';

const historyRouter = express.Router();

// ======================================
// History
// ======================================

/**
 * GET /history
 */
historyRouter.get('/', function(req, res, next) {
  console.log("Get All history");
  let data = historyService.all();
  res.json(data);
});

/**
 * POST /history
 * 
 * Create a new history
 */
historyRouter.post('/', function(req, res, next) {
  let history: History = req.body;
  historyService.create(history);
  res.send({title: 'Created t', data: history});
});

export { historyRouter };