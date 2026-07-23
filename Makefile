.PHONY: install test lint typecheck audit precommit build-docker run

install: ## Install the pinned dependencies.
	npm ci

test: ## Build TypeScript and run the unit and inventory tests.
	npm test

lint: ## Lint TypeScript source and tests.
	npm run lint

typecheck: ## Type-check TypeScript source and tests.
	npm run typecheck

audit: ## Audit production dependencies for high-severity vulnerabilities.
	npm run audit

precommit: ## Run every repository pre-commit hook.
	pre-commit run --all-files

build-docker: ## Build the non-root bluesky-mcp image locally.
	docker build -t bluesky-mcp:local .

run: ## Run the streamable HTTP MCP locally.
	npm start
