import { Op } from 'sequelize';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import ModelRepository from '../db/repository/base';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enumerators/error';
import { AuthCodeError } from '../utils/error/business-errors';
import { sha256 } from '../utils/utils';
import Constants from '../constants';
import UserService from './user';

const UserModel = db.models.User;

export default class AuthService {
  static async login(login, password) {
    login = login.toLowerCase();

    const user = await ModelRepository.selectOne(UserModel, {
      where: {
        [Op.or]: [{ email: login }, { cpf: login }],
        password: sha256(password),
        deletedAt: null,
      },
      attributes: ['id', 'name', 'email', 'userType'],
    });

    if (!user) {
      throw new ExtendableError(ErrorType.UNAUTHORIZED, AuthCodeError.BAD_CREDENTIALS, httpStatus.UNAUTHORIZED);
    }

    const response = {
      accessToken: await AuthService.generateToken(user.toJSON()),
    };

    return response;
  }

  static async generateToken(user) {
    const token = jwt.sign(
      user,
      Constants.auth.jwtSecret,
      { expiresIn: Constants.auth.accessTokenLifetime },
    );

    return token;
  }

  static async authenticate(token) {
    let verifiedToken;

    try {
      verifiedToken = jwt.verify(token, Constants.auth.jwtSecret);
    } catch (err) {
      throw new ExtendableError(ErrorType.UNAUTHORIZED, AuthCodeError.AUTHENTICATION_FAILED, httpStatus.UNAUTHORIZED);
    }

    if (!verifiedToken) {
      throw new ExtendableError(ErrorType.UNAUTHORIZED, AuthCodeError.AUTHENTICATION_FAILED, httpStatus.UNAUTHORIZED);
    }

    const user = await UserService.getById(verifiedToken.id);

    return { user: user.toJSON(), token };
  }

  static async logout() {
    return { accessToken: null };
  }
}
