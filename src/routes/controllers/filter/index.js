import { createDtRangeSearch, stringTrim } from './helper';

export const commonFilters = (req) => {
  let searchParameters = {};

  searchParameters = createDtRangeSearch(searchParameters, 'createdAtRange', req.query.createdAtRange);
  searchParameters = createDtRangeSearch(searchParameters, 'updatedAtRange', req.query.updatedAtRange);

  return searchParameters;
};

export const userFilters = (req) => {
  let searchParameters = {};

  searchParameters = stringTrim(searchParameters, 'email', req.query.email);
  searchParameters = stringTrim(searchParameters, 'name', req.query.name);
  searchParameters = stringTrim(searchParameters, 'cpf', req.query.cpf);

  if (req.query.userType) {
    searchParameters.userType = req.query.userType.split(',');
  }

  return searchParameters;
};

export const fileFilters = (req) => {
  let searchParameters = {};

  searchParameters = stringTrim(searchParameters, 'extension', req.query.extension);
  searchParameters = stringTrim(searchParameters, 'name', req.query.name);

  return searchParameters;
};
