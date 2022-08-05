import path from 'path';
import fs from 'fs';
import getParser from './src/parsers.js';
import format from './src/formatters.js';
import buildDiff from './src/differ.js';

const getAbsPath = (filepath) => path.resolve(process.cwd(), filepath);

export default (filepath1, filepath2, formatType = 'stylish') => {
  const abspath1 = getAbsPath(filepath1);
  const abspath2 = getAbsPath(filepath2);
  const parser1 = getParser(path.extname(filepath1));
  const parser2 = getParser(path.extname(filepath2));
  const data1 = parser1(fs.readFileSync(abspath1, 'utf-8'));
  const data2 = parser2(fs.readFileSync(abspath2, 'utf-8'));
  const diff = buildDiff(data1, data2);
  const result = format(formatType)(diff);
  return result;
};
