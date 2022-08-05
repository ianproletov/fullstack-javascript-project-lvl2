import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import getParser from './src/parsers.js';
import makeStylish from './src/formatters.js';

const getAbsPath = (filepath) => path.resolve(process.cwd(), filepath);

const buildDiff = (beforeData, afterData) => {
  const actions = [
    {
      action: (value1, value2) => ({ children: buildDiff(value1, value2), type: 'deep' }),
      isValid: (key, data1, data2) => _.isObject(data1[key]) && _.isObject(data2[key]),
    },
    {
      action: (value1) => ({ type: 'deleted', content: value1 }),
      isValid: (key, data1, data2) => _.has(data1, key) && !_.has(data2, key),
    },
    {
      action: (value1, value2) => ({ type: 'added', content: value2 }),
      isValid: (key, data1, data2) => !_.has(data1, key) && _.has(data2, key),
    },
    {
      action: (value1) => ({ type: 'same', content: value1 }),
      isValid: (key, data1, data2) => data1[key] === data2[key],
    },
    {
      action: (value1, value2) => ({ type: 'updated', previous: value1, next: value2 }),
      isValid: () => true,
    },
  ];
  const unsortedKeys = _.union(Object.keys(beforeData), Object.keys(afterData));
  const keys = _.sortBy(unsortedKeys);
  const result = keys.map((key) => {
    const { action } = actions.find(({ isValid }) => isValid(key, beforeData, afterData));
    return { key, ...action(beforeData[key], afterData[key]) };
  });
  return result;
};

export default (filepath1, filepath2) => {
  const abspath1 = getAbsPath(filepath1);
  const abspath2 = getAbsPath(filepath2);
  const parser1 = getParser(path.extname(filepath1));
  const parser2 = getParser(path.extname(filepath2));
  const data1 = parser1(fs.readFileSync(abspath1, 'utf-8'));
  const data2 = parser2(fs.readFileSync(abspath2, 'utf-8'));
  const tree = buildDiff(data1, data2);
  const result = makeStylish(tree);
  return result;
};
