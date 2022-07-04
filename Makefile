install:
	npm ci
gendiff-help:
	node bin/gendiff.js --help
gendiff:
	node bin/gendiff.js
publish:
	npm publish --dry-run
lint:
	npx eslint .
