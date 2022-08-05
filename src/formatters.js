import _ from 'lodash';

const replacer = '    ';

const stringify = (content, deep) => {
  if (!_.isObject(content)) {
    return content;
  }
  const lines = Object.keys(content).map((key) => `${replacer.repeat(deep + 1)}${key}: ${stringify(content[key], deep + 1)}`);
  return ['{', ...lines, `${replacer.repeat(deep)}}`].join('\n');
};

export default (sourceTree) => {
  const iter = (tree, deep) => {
    const map = {
      same: ({ key, content }) => `    ${key}: ${stringify(content, deep + 1)}`,
      added: ({ key, content }) => `  + ${key}: ${stringify(content, deep + 1)}`,
      deleted: ({ key, content }) => `  - ${key}: ${stringify(content, deep + 1)}`,
      updated: ({ key, previous, next }) => [
        `  - ${key}: ${stringify(previous, deep + 1)}`,
        `  + ${key}: ${stringify(next, deep + 1)}`,
      ],
      deep: ({ key, children }) => `    ${key}: ${iter(children, deep + 1)}`,
    };
    const lines = tree
      .flatMap((data) => {
        const { type } = data;
        return map[type](data);
      })
      .map((line) => `${replacer.repeat(deep)}${line}`);
    return ['{', ...lines, `${replacer.repeat(deep)}}`].join('\n');
  };
  return iter(sourceTree, 0);
};
