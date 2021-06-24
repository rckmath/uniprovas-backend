import multer from 'multer';
import Constants from '../../constants';

export default function upload() {
  return (req, res, next) => {
    multer({
      limits: {
        files: 1,
        fileSize: Constants.fileSizeLimit,
      },
    }).single('file')(req, res, next);
  };
}
