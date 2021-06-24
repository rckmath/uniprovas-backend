import { Op } from 'sequelize';
import crypto from 'crypto';
import dayjs from 'dayjs';
import httpStatus from 'http-status';
import ModelRepository from '../db/repository/base';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { UserCodeError, ValidationCodeError, AuthCodeError } from '../utils/error/business-errors';
import ErrorType from '../enumerators/error';
import { UserType } from '../enumerators/user';
import { serviceOrderHelper, sha256 } from '../utils/utils';
import SearchParameter from './search-parameters';
import MailService from './mailing';

const UserModel = db.models.User;

const PrivateMethods = {
  checkIfUserExists: (exists, user) => {
    const emailExists = user.email === exists.email;
    const cpfExists = user.cpf === exists.cpf;

    if (cpfExists) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.CPF_ALREADY_REGISTERED, httpStatus.CONFLICT);
    }

    if (emailExists) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.EMAIL_ALREADY_REGISTERED, httpStatus.CONFLICT);
    }
  },
};

const Toolbox = {
  getExistentUser: async (user) => {
    const or = [];

    if (user.cpf) { or.push({ cpf: user.cpf }); }

    if (user.email) { or.push({ email: user.email }); }

    const exists = await ModelRepository.selectOne(UserModel, {
      where: { [Op.or]: or, deletedAt: null },
    });

    if (exists) { PrivateMethods.checkIfUserExists(exists, user); }

    return exists;
  },
};

export default class UserService {
  static async createPatient(user) {
    user.type = UserType.STUDENT;

    return UserService.create(user);
  }

  static async create(user, actor) {
    await Toolbox.getExistentUser(user);

    const response = await ModelRepository.create(UserModel, {
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      password: sha256(user.password),
      phone: user.phone,
      birthday: user.birthday,

      genderType: user.gender,
      userType: user.type,

      createdBy: actor && actor.id,
    });

    MailService.sendRegister(response);

    return response;
  }

  static async getSimpleById(id) {
    const user = await ModelRepository.selectOne(UserModel, { where: { id, deletedAt: null } });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return user;
  }

  static async getById(id) {
    const user = await ModelRepository.selectOne(UserModel, {
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return user;
  }

  static async getAllWithPagination(searchParameters) {
    let response = null;
    let where = {};

    const commonQuery = SearchParameter.createCommonQuery(searchParameters);
    const userQuery = SearchParameter.createUserQuery(searchParameters);

    where = { ...where, ...commonQuery.where, ...userQuery.where };

    response = await ModelRepository.selectWithPagination(UserModel, {
      where,
      offset: searchParameters.offset,
      limit: searchParameters.limit,
      order: [serviceOrderHelper(searchParameters)],
    });

    return response;
  }

  static async updateById(id, user, actor) {
    if (actor.userType !== UserType.ADMIN) {
      if (user.userType || user.cpf || user.email || user.name) {
        throw new ExtendableError(
          ErrorType.FORBIDDEN, AuthCodeError.ACCESS_NOT_ALLOWED, httpStatus.FORBIDDEN,
        );
      }
    }

    await ModelRepository.updateById(UserModel, id, {
      userType: user.type,
      genderType: user.genderType,

      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      birthday: user.birthday,
      recoveryToken: user.recoveryToken,
      recoveryTokenExpiresAt: user.recoveryTokenExpiresAt,

      ip: user.ip,

      updatedBy: actor && actor.id,
    });
  }

  static async generateRecoveryToken(email) {
    const user = await ModelRepository.selectOne(UserModel, { where: { email, deletedAt: null } });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    const recoveryToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    await ModelRepository.updateById(UserModel, user.id, {
      recoveryToken, recoveryTokenExpiresAt: dayjs().add(30, 'minute').toDate(),
    });

    await MailService.sendRecoveryToken(user, recoveryToken);

    return { email };
  }

  static async validateRecoveryToken(email, recoveryToken) {
    const user = await ModelRepository.selectOne(UserModel, {
      attributes: ['id', 'recoveryToken'],
      where: {
        email,
        recoveryToken,
        recoveryTokenExpiresAt: { [Op.gt]: dayjs().toDate() },
        deletedAt: null,
      },
    });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, ValidationCodeError.INVALID_TOKEN, httpStatus.BAD_REQUEST);
    }

    return user;
  }

  static async recoveryPassword(id, { token: recoveryToken, password }) {
    const user = await ModelRepository.selectOne(UserModel, {
      attributes: ['id'],
      where: {
        id,
        recoveryToken,
        recoveryTokenExpiresAt: { [Op.gt]: dayjs().toDate() },
        deletedAt: null,
      },
    });

    if (!user) {
      await ModelRepository.updateById(UserModel, id, {
        recoveryToken: null,
        recoveryTokenExpiresAt: null,
      });

      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    password = sha256(password);

    await ModelRepository.updateById(UserModel, id, {
      password,
      recoveryToken: null,
      recoveryTokenExpiresAt: null,
    });
  }

  static async updatePassword(id, { oldPassword, newPassword }) {
    if (oldPassword === newPassword) {
      throw new ExtendableError(
        ErrorType.BUSINESS,
        ValidationCodeError.OLD_AND_NEW_PASSWORD_ARE_THE_SAME,
        httpStatus.BAD_REQUEST,
      );
    }

    const user = await ModelRepository.selectOne(UserModel, {
      where: { id, password: sha256(oldPassword), deletedAt: null },
    });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, ValidationCodeError.BAD_PASSWORD, httpStatus.BAD_REQUEST);
    }

    await ModelRepository.updateById(UserModel, id, { password: sha256(newPassword), updatedBy: id });
  }

  static async deleteById(id, actor) {
    await UserService.getById(id);
    await ModelRepository.deleteById(UserModel, id, actor && actor.id);
  }
}
