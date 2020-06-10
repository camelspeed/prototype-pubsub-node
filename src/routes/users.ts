import { userService } from '../services/publishers/userService';
import { User } from '../services/model';
import * as express from 'express';

const usersRouter = express.Router();

// ======================================
// Users
// ======================================

/**
 * GET /users
 */
usersRouter.get('/', function(req, res, next) {
  let data = userService.all();
  res.json(data);
});

/**
 * POST /users
 * 
 * Create a new user
 */
usersRouter.post('/', function(req, res, next) {
  let user: User = req.body;
  userService.create(user);
  res.send({title: 'Created User', data: user});
});

/**
 * PATCH /users/:id
 * 
 * Update an existing user
 */
usersRouter.patch('/:id', function(req, res, next) {
  let user: User = req.body;
  userService.update(user);
  res.json(user);
});

export {  usersRouter };