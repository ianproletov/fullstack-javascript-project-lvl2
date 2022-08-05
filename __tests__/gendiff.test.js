import fs from 'fs';
import path from 'path';
import gendiff from '../index.js';

const getFixturePath = (filename) => path.join('__tests__/__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('plain json', () => {
  it.each(['json'])('%p diff test', (ext) => {
    const beforeName = `before.${ext}`;
    const afterName = `after.${ext}`;
    const actual = gendiff(getFixturePath(beforeName), getFixturePath(afterName));
    const expected = readFile('diffjson').trim();
    expect(actual).toBe(expected);
  });
});
