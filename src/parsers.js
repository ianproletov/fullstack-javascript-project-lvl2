import yaml from 'js-yaml';

export default (extname) => {
  const map = {
    '.json': JSON.parse,
    '.yml': yaml.load,
    '.yaml': yaml.load,
  };
  return map[extname];
};
