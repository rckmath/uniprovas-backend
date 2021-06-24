import { Op } from 'sequelize';

export default class SearchParameter {
  static createCommonQuery(searchParameters, includeDeleted = false) {
    const where = {};

    if (!includeDeleted) { where.deletedAt = null; }

    /**
     * Dates
     */
    if (searchParameters.createdAtStart) {
      where.createdAt = {
        ...where.createdAt,
        [Op.gte]: searchParameters.createdAtStart,
      };
    }

    if (searchParameters.createdAtEnd) {
      where.createdAt = {
        ...where.createdAt,
        [Op.lte]: searchParameters.createdAtEnd,
      };
    }

    if (searchParameters.updatedAtStart) {
      where.updatedAt = {
        ...where.updatedAt,
        [Op.gte]: searchParameters.updatedAtStart,
      };
    }

    if (searchParameters.updatedAtEnd) {
      where.updatedAt = {
        ...where.updatedAt,
        [Op.lte]: searchParameters.updatedAtEnd,
      };
    }

    return { where };
  }

  static createUserQuery(searchParameters) {
    const where = {};

    if (searchParameters.email) {
      where.email = { [Op.iLike]: `%${searchParameters.email}%` };
    }

    if (searchParameters.name) {
      where.name = { [Op.iLike]: `%${searchParameters.name}%` };
    }

    if (searchParameters.cpf) {
      where.cpf = searchParameters.cpf;
    }

    if (searchParameters.userType) {
      where.userType = { [Op.or]: searchParameters.userType };
    }

    return { where };
  }

  static createFileQuery(searchParameters) {
    const where = {};

    if (searchParameters.extension) {
      where.email = { [Op.iLike]: `%${searchParameters.extension}%` };
    }

    if (searchParameters.name) {
      where.name = { [Op.iLike]: `%${searchParameters.name}%` };
    }

    return { where };
  }
}
