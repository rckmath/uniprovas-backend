import express from 'express';
import httpStatus from 'http-status';
import { authSchema } from '../schema';
import AuthService from '../../services/auth';
import { schemaValidation, authenticate, authorize } from '../middlewares';
import { UserType } from '../../enumerators/user';

const routes = express.Router();

routes.post('/',
  schemaValidation(authSchema.signIn),
  async (req, res, next) => {
    let response;

    try {
      response = await AuthService.login(req.body.login, req.body.password);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.post('/logout',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC, UserType.PATIENT]),
  async (_req, res, next) => {
    let response;

    try {
      response = await AuthService.logout();
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
