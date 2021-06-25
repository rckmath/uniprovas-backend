import express from 'express';
import httpStatus from 'http-status';
import CategoryService from '../../services/category';
import { UserType } from '../../enumerators/user';
import { authenticate, authorize } from '../middlewares';

const routes = express.Router();

routes.post('/',
  authenticate,
  authorize([UserType.ADMIN]),
  async (req, res, next) => {
    let response;

    try {
      response = await CategoryService.create(req.body, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.get('/',
  authenticate,
  authorize([UserType.ADMIN, UserType.STUDENT]),
  async (req, res, next) => {
    let response;

    try {
      response = await CategoryService.getAll();
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
