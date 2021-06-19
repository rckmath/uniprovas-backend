import httpStatus from 'http-status';
import path from 'path';
import * as fs from 'fs';
import mjml2html from 'mjml';
import Mail from '../mechanisms/mailing';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enumerators/error';
import { stringReplace } from '../utils/utils';
import GoogleAuthService from './google/auth';
import { UserGenderType } from '../enumerators/user';

const readFile = (fileName) => new Promise((resolve, reject) => {
  const templatePath = path.join(__dirname, '../', 'templates/', 'mailing/', fileName);

  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) { reject(err); }

    resolve(template);
  });
});

export default class MailService {
  static async sendRecoveryToken(user, recoveryToken) {
    try {
      let mjml = await readFile('password-recovery.mjml');

      mjml = stringReplace(mjml, {
        name: user.name,
        token: recoveryToken,
        year: new Date().getFullYear(),
      });

      const { html } = mjml2html(mjml, { minify: true });
      const access = await GoogleAuthService.OAuth();

      await Mail.send(access, user.email, `${user.name}, sua solicitação de recuperação de senha`, html);
    } catch (err) {
      throw new ExtendableError(ErrorType.MAIL, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  static async sendRegister(user) {
    try {
      let mjml = await readFile('register.mjml');

      const [firstName] = user.name.split(' ');

      let g = 'o';

      if (user.genderType === UserGenderType.FEMALE) { g = 'a'; }

      mjml = stringReplace(mjml, {
        g,
        name: firstName,
        year: new Date().getFullYear(),
      });

      const { html } = mjml2html(mjml, { minify: true });
      const access = await GoogleAuthService.OAuth();

      await Mail.send(access, user.email, `${firstName}, seja bem-vind${g} à MedTech!`, html);
    } catch (err) {
      throw new ExtendableError(ErrorType.MAIL, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
