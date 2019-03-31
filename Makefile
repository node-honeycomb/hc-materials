$(eval ESLINT_FILES=$(shell ls -S `find ./src -type f -not -path "*/node_modules/*" -not -path "./dist/*" -not -path "./out/*" -not -path "*/.build/*" -not -path "*/.package/*" -name "*.[js][jsx]"`))

eslint:
	@echo 'eslint doing...'
	@./node_modules/.bin/eslint ${ESLINT_FILES}
	@echo 'eslint done!'

publish:
	@$(eval VERSION=`node -e 'console.log(require("./package.json").version)'`)
	@$(eval TAG='publish/'${VERSION})
	@git tag ${TAG}
	git push origin ${TAG}
	npm publish --registry=http://registry.npmjs.org

.PHONY: eslint publish
