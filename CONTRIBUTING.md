# CONTRIBUTING.md — PROJECT LOOP

## Branch Naming & Workflow Conventions
- `main`: Production stable release branch.
- `feature/<feature-name>`: Feature development branches.
- `fix/<bug-name>`: Bugfix branches.

## Commit Message Style
Follow Conventional Commits:
- `feat: add CSV ingestion wizard with row validation`
- `fix: resolve chart tooltip clipping on dark mode`
- `test: add unit tests for trend growth math`

## Local Verification Commands
Before opening a pull request, run all checks:
```bash
npm run type-check
npm run test
npm run build
```
