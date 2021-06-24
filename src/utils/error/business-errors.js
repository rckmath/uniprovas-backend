const ValidationCodeError = {
  INVALID_ID: 'invalid_id',
  BAD_PASSWORD: 'bad_password',
  INVALID_FILE: 'invalid_file',
  INVALID_EMAIL: 'invalid_email',
  INVALID_TOKEN: 'invalid_token',
  INVALID_PARAMS: 'invalid_params',
  INVALID_PASSWORD: 'invalid_password',
  OLD_AND_NEW_PASSWORD_ARE_THE_SAME: 'old_and_new_password_are_the_same',
};

const UserCodeError = {
  USER_NOT_FOUND: 'user_not_found',
  CPF_ALREADY_REGISTERED: 'cpf_already_registered',
  EMAIL_ALREADY_REGISTERED: 'email_already_registered',
};

const FileCodeError = {
  FILE_NOT_FOUND: 'file_not_found',
};

const AuthCodeError = {
  BAD_CREDENTIALS: 'bad_credentials',
  ACCESS_NOT_ALLOWED: 'access_not_allowed',
  AUTHENTICATION_FAILED: 'authentication_failed',
};

export {
  UserCodeError,
  FileCodeError,
  AuthCodeError,
  ValidationCodeError,
};
