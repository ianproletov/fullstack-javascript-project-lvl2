import _ from 'lodash';
import makeStylish from './stylish.js';
import makePlain from './plain.js';

const map = {
  stylish: makeStylish,
  plain: makePlain,
  json: JSON.stringify,
};

export default (format) => {
  if (!_.has(map, format)) {
    throw new Error(`Unknown format: ${format}`);
  }
  return map[format];
};
