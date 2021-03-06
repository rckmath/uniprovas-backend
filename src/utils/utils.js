import crypto from 'crypto';

export function stringReplace(base, params) {
  Object.keys(params).forEach((opt) => {
    base = base.replace(new RegExp(`\\{${opt}\\}`, 'g'), params[opt]);
  });

  return base;
}

export function sha256(stringToHash) {
  return crypto.createHash('sha256')
    .update(stringToHash)
    .digest('hex');
}

export function msToTime(s) {
  function pad(n, z) { return (`00${n}`).slice(-(z || 2)); }

  s = (s - (s % 1000)) / 1000;
  const secs = s % 60;

  s = (s - secs) / 60;
  const mins = s % 60;

  return `${pad((s - mins) / 60)}:${pad(mins)}:${pad(secs)}`;
}

export function controllerPaginationHelper(req) {
  return {
    offset: req.query.offset ? (req.query.offset * (req.query.limit || 10)) : 0,
    orderBy: req.query.orderBy && req.query.orderBy.split('.'),
    isDESC: req.query.isDESC === 'true',
    limit: req.query.limit || 10,
  };
}

export function serviceOrderHelper(searchParameters) {
  const order = (searchParameters.orderBy ? searchParameters.orderBy : ['createdAt']);

  order.push(searchParameters.isDESC ? 'DESC' : 'ASC');

  return order;
}
