import dayjs from 'dayjs';
import { UserType, UserGenderType } from '../../enumerators/user';
import {
  emailValidation, cpfValidation, phoneValidation,
  stringValidation, ipValidation, passwordValidation,
} from '../validators';

const userSchema = {
  create: {
    name: { ...stringValidation, errorMessage: 'invalid_name' },
    cpf: cpfValidation,
    password: passwordValidation,
    email: { ...emailValidation, optional: false },
    phone: { ...phoneValidation, optional: false },
    birthday: {
      in: 'body',
      isDate: true,
      custom: {
        options: (birthday) => dayjs(birthday).isBefore(dayjs()),
      },
      errorMessage: 'invalid_birthday',
    },
    gender: {
      in: 'body',
      custom: {
        options: (gender) => Object.values(UserGenderType).some((o) => o === gender),
      },
      errorMessage: 'invalid_gender',
    },
    type: {
      in: 'body',
      custom: {
        options: (type) => Object.values(UserType).some((o) => o === type),
      },
      optional: true,
      errorMessage: 'invalid_user_type',
    },
  },
  update: {
    name: { ...stringValidation, optional: true, errorMessage: 'invalid_name' },
    phone: phoneValidation,
    cpf: { ...cpfValidation, optional: true },
    ip: ipValidation,
    email: emailValidation,
    profilePhoto: {
      in: 'body',
      custom: {
        // eslint-disable-next-line max-len
        options: (profilePhoto) => /^data:image\/(?:png|jpeg|jpg)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g.test(profilePhoto),
      },
      optional: true,
      errorMessage: 'invalid_photo_file',
    },
    type: {
      in: 'body',
      custom: {
        options: (type) => Object.values(UserType).some((o) => o === type),
      },
      optional: true,
      errorMessage: 'invalid_user_type',
    },
  },
};

export default userSchema;
