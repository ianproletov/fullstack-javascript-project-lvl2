import fs from 'fs';
import path from 'path';
import gendiff from '../index.js';

const getFixturePath = (filename) => path.join('__tests__/__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('plain json', () => {
  const actual = gendiff(getFixturePath('before.json'), getFixturePath('after.json'));
  const expected = readFile('diffjson').trim();
  expect(actual).toBe(expected);
});
