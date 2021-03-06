import { dataProductService } from '../services/subscribers/dataProductService';
import { DataProduct } from '../services/model';
import * as express from 'express';

const dataProductRouter = express.Router();

// ======================================
// Data Products
// ======================================

/**
 * GET /dataproducts
 */
dataProductRouter.get('/', async(req, res, next) => {
  console.log("Get All Data Products");
  let data = await dataProductService.all();
  res.json(data);
});

/**
 * POST /dataproducts
 * 
 * Create a new Data Products
 */
dataProductRouter.post('/', async (req, res, next) => {
  console.log("Post Data Products");
  let dataProduct: DataProduct = req.body;
  dataProductService.create(dataProduct);
  res.send({title: 'Created Data Product', data: dataProduct});
});

export { dataProductRouter };