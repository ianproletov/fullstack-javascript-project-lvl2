import _ from 'lodash';

const stringify = (content) => {
  if (_.isObject(content)) {
    return '[complex value]';
  }
  if (typeof content === 'string') {
    return `'${content}'`;
  }
  return content;
};

const makePlain = (sourceTree) => {
  const iter = (parents, tree) => {
    const map = {
      same: () => [],
      added: (fullKey, { content }) => `Property '${fullKey}' was added with value: ${stringify(content)}`,
      deleted: (fullKey) => `Property '${fullKey}' was removed`,
      updated: (fullKey, { previous, next }) => `Property '${fullKey}' was updated. From ${stringify(previous)} to ${stringify(next)}`,
      deep: (fullKey, { key, children }) => iter([...parents, key], children),
    };
    const lines = tree.flatMap((data) => {
      const { type, key } = data;
      const fullKey = [...parents, key].join('.');
      return map[type](fullKey, data);
    });
    return lines.join('\n');
  };
  return iter([], sourceTree);
};

export default makePlain;
