import dayjs from 'dayjs';

export function stringTrim(searchParameters, attrName, attrValue) {
  if (attrName && attrValue && attrValue.trim().length > 0) {
    searchParameters[`${attrName}`] = attrValue.trim();
  }

  return searchParameters;
}

export function createDtRangeSearch(searchParameters, attrName, attrValue) {
  if (attrName && attrValue) {
    const [startAt, endAt] = attrValue.split(',');

    searchParameters[`${attrName}`] = {
      startAt: (startAt && dayjs(startAt).isValid()) && dayjs(startAt).format(),
      endAt: (endAt && dayjs(endAt).isValid()) && dayjs(endAt).format(),
    };
  }

  return searchParameters;
}
