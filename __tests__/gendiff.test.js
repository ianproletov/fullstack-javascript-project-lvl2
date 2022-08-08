import fs from 'fs';
import path from 'path';
import gendiff from '../index.js';

const getFixturePath = (filename) => path.join('__tests__/__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe.each(['default', 'stylish', 'plain'])('%p format', (format) => {
  it.each(['json', 'yml'])('%p diff test', (ext) => {
    const beforeName = `before.${ext}`;
    const afterName = `after.${ext}`;
    const actual = gendiff(getFixturePath(beforeName), getFixturePath(afterName), format === 'default' ? undefined : format);
    const diffname = `${format === 'default' ? 'stylish' : format}diff`;
    const expected = readFile(diffname).trim();
    expect(actual).toBe(expected);
  });
});

test('should throw error if formatter is wrong', () => {
  expect(() => gendiff(getFixturePath('before.json'), getFixturePath('after.json'), 'wrong')).toThrowError(/Unknown format/);
});
