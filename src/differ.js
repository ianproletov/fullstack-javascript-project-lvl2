import _ from 'lodash';

const commonActions = [
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

const buildDiff = (beforeData, afterData) => {
  const actions = [
    {
      action: (value1, value2) => ({ children: buildDiff(value1, value2), type: 'deep' }),
      isValid: (key, data1, data2) => _.isObject(data1[key]) && _.isObject(data2[key]),
    },
    ...commonActions,
  ];
  const unsortedKeys = _.union(Object.keys(beforeData), Object.keys(afterData));
  const keys = _.sortBy(unsortedKeys);
  const result = keys.map((key) => {
    const { action } = actions.find(({ isValid }) => isValid(key, beforeData, afterData));
    return { key, ...action(beforeData[key], afterData[key]) };
  });
  return result;
};

export default buildDiff;
