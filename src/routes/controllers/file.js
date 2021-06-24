import express from 'express';
import httpStatus from 'http-status';
import { param, validationResult } from 'express-validator';
import { fileSchema } from '../schema';
import FileService from '../../services/file';
import { UserType } from '../../enumerators/user';
import {
  schemaValidation, authenticate, authorize, upload,
} from '../middlewares';
import { ValidationCodeError } from '../../utils/error/business-errors';
import { controllerPaginationHelper } from '../../utils/utils';
import { commonFilters, fileFilters } from './filter';
import ExtendableError from '../../utils/error/extendable';
import ErrorType from '../../enumerators/error';

const routes = express.Router();

routes.post('/',
  authenticate,
  authorize([UserType.ADMIN, UserType.STUDENT]),
  upload(),
  schemaValidation(fileSchema.upload),
  async (req, res, next) => {
    let response;

    try {
      if (!req.file) {
        throw new ExtendableError(ErrorType.BUSINESS, ValidationCodeError.INVALID_FILE, httpStatus.BAD_REQUEST);
      }

      response = await FileService.upload({ ...req.body, data: req.file });
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.get('/my',
  authenticate,
  authorize([UserType.ADMIN, UserType.STUDENT]),
  async (req, res, next) => {
    let response;

    try {
      response = await FileService.getMyFiles(req.user.id);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.get('/:id',
  authenticate,
  authorize([UserType.ADMIN]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await FileService.getById(req.params.id, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.get('/',
  authenticate,
  authorize([UserType.ADMIN]),
  async (req, res, next) => {
    let response;

    try {
      const searchParameters = {
        ...controllerPaginationHelper(req),
        ...commonFilters(req),
        ...fileFilters(req),
      };

      response = await FileService.getAllWithPagination(searchParameters, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/:id',
  authenticate,
  authorize([UserType.ADMIN, UserType.STUDENT]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      response = await FileService.updateById(req.params.id, req.body, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.delete('/:id',
  authenticate,
  authorize([UserType.ADMIN]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await FileService.deleteById(req.params.id, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
