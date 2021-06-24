const fileSchema = {
  upload: {
    title: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'invalid_title',
    },
  },
};

export default fileSchema;
