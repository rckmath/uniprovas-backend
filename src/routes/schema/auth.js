const authSchema = {
  signIn: {
    login: {
      in: 'body',
      isString: true,
      notEmpty: true,
      custom: {
        options: (login) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}/g.test(login) || /^[0-9]{11}/g.test(login),
      },
      errorMessage: 'invalid_login',
    },
    password: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'invalid_password',
    },
  },
};

export default authSchema;
