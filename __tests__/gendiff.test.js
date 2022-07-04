import fs from 'fs';
import gendiff from '../index.js';

test('plain json', () => {
  const actual = gendiff('__tests__/__fixtures__/file1.json', '__tests__/__fixtures__/file2.json');
  const expected = fs.readFileSync('__tests__/__fixtures__/resjson', 'utf-8').trim();
  expect(actual).toBe(expected);
});
