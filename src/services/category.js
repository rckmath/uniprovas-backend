import { Op } from 'sequelize';
import ModelRepository from '../db/repository/base';
import db from '../db/database';

const CategoryModel = db.models.Category;

export default class UserService {
  static async create(category, actor) {
    const response = await ModelRepository.create(CategoryModel, {
      title: category.title,

      createdBy: actor && actor.id,
      updatedBy: actor && actor.id,
    });

    return response;
  }

  static async getAll() {
    const response = await ModelRepository.selectAll(CategoryModel);

    return response;
  }

  static async getAllByIdList(idList) {
    let response = null;

    response = await ModelRepository.selectAll(CategoryModel, {
      where: { id: { [Op.in]: idList }, deletedAt: null },
    });

    return response;
  }
}
