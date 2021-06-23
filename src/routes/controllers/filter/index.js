import { createDtRangeSearch, stringTrim } from './helper';

export const commonFilters = (req) => {
  let searchParameter = {};

  searchParameter = createDtRangeSearch(searchParameter, 'createdAtRange', req.query.createdAtRange);
  searchParameter = createDtRangeSearch(searchParameter, 'updatedAtRange', req.query.updatedAtRange);

  return searchParameter;
};

export const userFilters = (req) => {
  let searchParameter = {};

  searchParameter = stringTrim(searchParameter, 'email', req.query.email);
  searchParameter = stringTrim(searchParameter, 'name', req.query.name);
  searchParameter = stringTrim(searchParameter, 'cpf', req.query.cpf);

  if (req.query.userType) {
    searchParameter.userType = req.query.userType.split(',');
  }

  return searchParameter;
};
