install:
	npm ci
gendiff-help:
	node bin/gendiff.js --help
gendiff:
	node bin/gendiff.js __tests__/__fixtures__/file1.json __tests__/__fixtures__/file2.json 
publish:
	npm publish --dry-run
lint:
	npx eslint .
test:
	npm test
test-coverage:
	npm test -- --coverage
