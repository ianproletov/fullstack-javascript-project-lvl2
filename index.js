import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const getAbsPath = (filepath) => path.resolve(process.cwd(), filepath);

const actions = [
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

const buildDiff = (data1, data2) => {
  const unsortedKeys = _.union(Object.keys(data1), Object.keys(data2));
  const keys = _.sortBy(unsortedKeys);
  const result = keys.map((key) => {
    const { action } = actions.find(({ isValid }) => isValid(key, data1, data2));
    return { key, ...action(data1[key], data2[key]) };
  });
  return result;
};

const map = {
  same: ({ key, content }) => `    ${key}: ${content}`,
  added: ({ key, content }) => `  + ${key}: ${content}`,
  deleted: ({ key, content }) => `  - ${key}: ${content}`,
  updated: ({ key, previous, next }) => [
    `  - ${key}: ${previous}`,
    `  + ${key}: ${next}`,
  ],
};

const makeImage = (tree) => {
  const lines = tree.flatMap((data) => {
    const { type } = data;
    return map[type](data);
  });
  return ['{', ...lines, '}'].join('\n');
};

export default (filepath1, filepath2) => {
  const abspath1 = getAbsPath(filepath1);
  const abspath2 = getAbsPath(filepath2);
  const data1 = JSON.parse(fs.readFileSync(abspath1, 'utf-8'));
  const data2 = JSON.parse(fs.readFileSync(abspath2, 'utf-8'));
  const tree = buildDiff(data1, data2);
  const result = makeImage(tree);
  return result;
};
