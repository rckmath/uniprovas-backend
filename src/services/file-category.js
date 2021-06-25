import httpStatus from 'http-status';
import ModelRepository from '../db/repository/base';

import db from '../db/database';
import CategoryService from './category';
import { CategoryCodeError } from '../utils/error/business-errors';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enumerators/error';

const FileCategoryModel = db.models.FileCategory;

export default class FileCategoryService {
  static async create(fileCategory, actor, options) {
    let response = null;

    fileCategory = {
      categoryId: fileCategory.categoryId,
      fileId: fileCategory.fileId,

      createdBy: actor && actor.id,
      updatedBy: actor && actor.id,
    };

    response = await ModelRepository.create(FileCategoryModel, fileCategory, options);

    return response;
  }

  static async createByCategoryList(fileId, categoryList, actor, options) {
    let response = null;

    const categories = categoryList.map((o) => ({ id: o }));
    const categoryListSaved = await CategoryService.getAllByIdList(categoryList);

    if (!categories.every((category) => categoryListSaved.some(
      (categorySaved) => categorySaved.id === category.id,
    ))) {
      throw new ExtendableError(ErrorType.BUSINESS, CategoryCodeError.CATEGORY_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    response = await Promise.all(
      categoryList
        .map((o) => categories.find((oo) => oo.id === o))
        .map((category) => FileCategoryService.create({
          fileId,
          categoryId: category.id,
        }, actor, options)),
    );

    return response;
  }
}
