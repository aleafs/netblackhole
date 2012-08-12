test:
	@npm install
	@./node_modules/mocha/bin/mocha --reporter spec --timeout 5000 test/*.js

.PHONY: test
