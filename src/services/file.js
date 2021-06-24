import httpStatus from 'http-status';
import dayjs from 'dayjs';
import ModelRepository from '../db/repository/base';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { FileCodeError } from '../utils/error/business-errors';
import ErrorType from '../enumerators/error';
import { serviceOrderHelper } from '../utils/utils';
import SearchParameter from './search-parameters';
import S3Amazon from '../mechanisms/storage-aws';
import Constants from '../constants';

const FileModel = db.models.File;

export default class FileService {
  static async upload(file, actor) {
    const extension = file.data.originalname.split('.').pop();
    const timestamp = dayjs().unix();

    const fileCompleteName = `${timestamp}_${file.data.originalname}`;

    const url = await S3Amazon.uploadBuffer(Constants.aws.bucket, {
      name: fileCompleteName,
      buffer: file.data.buffer,
      encoding: file.data.encoding,
      contentType: file.data.mimetype,
    });

    return;

    const response = await ModelRepository.create(FileModel, {
      url,
      extension,
      timestamp,

      userId: actor.id,

      title: file.title,
      name: fileCompleteName,
      mimeType: file.data.mimetype,
      size: file.data.size,
      upVotes: file.upVotes,
      downloadCount: file.downloadCount,
      description: file.description,
      hide: !!file.hide,

      createdBy: actor && actor.id,
      updatedBy: actor && actor.id,
    });

    return response;
  }

  static async getSimpleById(id) {
    const file = await ModelRepository.selectOne(FileModel, { where: { id, deletedAt: null } });

    if (!file) {
      throw new ExtendableError(ErrorType.BUSINESS, FileCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return file;
  }

  static async getById(id) {
    const file = await ModelRepository.selectOne(FileModel, {
      where: { id, deletedAt: null },
    });

    if (!file) {
      throw new ExtendableError(ErrorType.BUSINESS, FileCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return file;
  }

  static async getAllWithPagination(searchParameters) {
    let response = null;
    let where = {};

    const commonQuery = SearchParameter.createCommonQuery(searchParameters);
    const fileQuery = SearchParameter.createFileQuery(searchParameters);

    where = { ...where, ...commonQuery.where, ...fileQuery.where };

    response = await ModelRepository.selectWithPagination(FileModel, {
      where,
      offset: searchParameters.offset,
      limit: searchParameters.limit,
      order: [serviceOrderHelper(searchParameters)],
    });

    return response;
  }

  static async updateById(id, file, actor) {
    await ModelRepository.updateById(FileModel, id, {
      title: file.title,
      upVotes: file.upVotes,
      downloadCount: file.downloadCount,
      description: file.description,
      hide: file.hide,

      updatedBy: actor && actor.id,
    });
  }

  static async deleteById(id, actor) {
    await FileService.getById(id);
    await ModelRepository.deleteById(FileModel, id, actor && actor.id);
  }
}
