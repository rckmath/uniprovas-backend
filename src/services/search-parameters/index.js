import { Op } from 'sequelize';

export default class SearchParameter {
  static createCommonQuery(searchParameter, includeDeleted = false) {
    const where = {};

    if (!includeDeleted) { where.deletedAt = null; }

    /**
     * Dates
     */

    if (searchParameter.createdAtStart) {
      where.createdAt = {
        ...where.createdAt,
        [Op.gte]: searchParameter.createdAtStart,
      };
    }

    if (searchParameter.createdAtEnd) {
      where.createdAt = {
        ...where.createdAt,
        [Op.lte]: searchParameter.createdAtEnd,
      };
    }

    if (searchParameter.updatedAtStart) {
      where.updatedAt = {
        ...where.updatedAt,
        [Op.gte]: searchParameter.updatedAtStart,
      };
    }

    if (searchParameter.updatedAtEnd) {
      where.updatedAt = {
        ...where.updatedAt,
        [Op.lte]: searchParameter.updatedAtEnd,
      };
    }

    return { where };
  }

  static createUserQuery(searchParameter) {
    const where = {};

    if (searchParameter.email) {
      where.email = { [Op.iLike]: `%${searchParameter.email}%` };
    }

    if (searchParameter.name) {
      where.name = { [Op.iLike]: `%${searchParameter.name}%` };
    }

    if (searchParameter.cpf) {
      where.cpf = searchParameter.cpf;
    }

    if (searchParameter.userType) {
      where.userType = { [Op.or]: searchParameter.userType };
    }

    return { where };
  }
}
