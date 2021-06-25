import AWS from 'aws-sdk';
import httpStatus from 'http-status';
import dayjs from 'dayjs';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enumerators/error';
import Constants from '../constants';

const S3 = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: Constants.aws.accessKey,
  secretAccessKey: Constants.aws.secretAccessKey,
  region: Constants.aws.region,
});

export default class S3Amazon {
  static async uploadBuffer(bucket, file, options) {
    let response = null;

    try {
      const uploadParams = {
        Key: file.name,
        Body: file.buffer,
        Bucket: bucket,
        ACL: 'public-read',
        ContentEncoding: file.encoding,
        ContentType: file.contentType,
      };

      await S3.upload(uploadParams).promise();

      const getParams = {
        Key: file.name,
        Bucket: bucket,
        Expires: options && dayjs(options.expiresAt).diff(dayjs(), 's'),
      };

      response = await S3.getSignedUrlPromise('getObject', getParams);

      [response] = response.split('?');
    } catch (err) {
      throw new ExtendableError(ErrorType.AWS, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }

    return response;
  }

  static async getFile(bucket, fileName) {
    let response = null;

    try {
      const params = {
        Key: fileName,
        Bucket: bucket,
      };

      response = await S3.getObject(params).promise();
    } catch (err) {
      throw new ExtendableError(ErrorType.AWS, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }

    return response;
  }
}
