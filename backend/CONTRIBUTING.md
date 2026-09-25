# Contributing Guide

Thank you for contributing to this project.

This document defines how we work with Git, organize backend features, create pull requests, and keep the codebase consistent as a team.

## 1. Development Workflow

We use a feature-branch workflow.

```text
main
 │
 ├── feature/authentication
 ├── feature/posts
 ├── feature/comments
 ├── feature/likes
 └── feature/profiles
```

### Rules

- `main` is the stable branch.
- Do not push directly to `main`.
- Every feature or bug fix must be developed on a separate branch.
- All changes must go through a Pull Request (PR).
- PRs must be reviewed before being merged.
- Keep branches short-lived and focused on one logical change.

---

## 2. Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Add the required environment variables to `.env`.

**Never commit `.env` or any file containing secrets.**

Start the development server:

```bash
npm run dev
```

---

## 3. Creating a Branch

Always start from the latest `main` branch.

```bash
git switch main
git pull origin main
```

Create a branch for your work:

```bash
git switch -c feature/<feature-name>
```

Examples:

```bash
git switch -c feature/user-authentication
git switch -c feature/create-post
git switch -c feature/post-comments
git switch -c feature/post-likes
```

For bug fixes:

```bash
git switch -c fix/<description>
```

Example:

```bash
git switch -c fix/duplicate-post-likes
```

---

## 4. Branch Naming

Use descriptive branch names.

### Features

```text
feature/<description>
```

Examples:

```text
feature/authentication
feature/create-post
feature/profile-update
```

### Bug fixes

```text
fix/<description>
```

Examples:

```text
fix/login-validation
fix/duplicate-likes
```

### Refactoring

```text
refactor/<description>
```

Example:

```text
refactor/auth-service
```

### Documentation

```text
docs/<description>
```

Example:

```text
docs/api-documentation
```

---

## 5. Commit Messages

Write clear and descriptive commit messages.

We follow this general format:

```text
type: description
```

Common types:

```text
feat
fix
refactor
test
docs
chore
```

Examples:

```bash
git commit -m "feat: add user registration"
git commit -m "feat: add post creation endpoint"
git commit -m "fix: prevent duplicate likes"
git commit -m "test: add post service tests"
git commit -m "refactor: simplify authentication middleware"
git commit -m "docs: update API documentation"
git commit -m "chore: update dependencies"
```

Avoid vague commits such as:

```text
changes
update
fix
stuff
final
new changes
```

---

## 6. Keep Features Modular

The backend should be organized around features/modules.

Example:

```text
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.routes.js
│   │   └── auth.schema.js
│   │
│   ├── users/
│   │   ├── users.controller.js
│   │   ├── users.service.js
│   │   ├── users.routes.js
│   │   └── users.schema.js
│   │
│   ├── posts/
│   │   ├── posts.controller.js
│   │   ├── posts.service.js
│   │   ├── posts.routes.js
│   │   └── posts.schema.js
│   │
│   ├── comments/
│   │   ├── comments.controller.js
│   │   ├── comments.service.js
│   │   ├── comments.routes.js
│   │   └── comments.schema.js
│   │
│   └── likes/
│       ├── likes.controller.js
│       ├── likes.service.js
│       ├── likes.routes.js
│       └── likes.schema.js
│
├── database/
├── middleware/
├── config/
└── app.js
```

Try to keep changes within the module you're working on.

For example, if you're implementing comments, avoid unnecessarily modifying the posts or authentication modules.

This helps reduce merge conflicts.

---

## 7. Shared Files

Some files will naturally be modified by multiple developers, such as:

```text
package.json
package-lock.json
prisma/schema.prisma
src/app.js
src/routes/index.js
```

Coordinate with the team before making significant changes to shared files.

In particular, database schema and migration changes should be communicated with the team before implementation.

---

## 8. Database Changes

Any database schema change must be committed alongside the feature that requires it.

Before making a database change, communicate what is being changed.

For example:

```text
Feature: Post likes

Database change:
- Add Like collection/model
- Add unique constraint on (post, user)
```

Do not manually modify the shared/production database without following the project's migration process.

---

## 9. API Response Format

All API endpoints should follow the project's standard response format.

### Success

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Post not found",
  "error": {
    "code": "POST_NOT_FOUND"
  }
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Please provide a valid email address"
    }
  }
}
```

Keep response structures consistent across endpoints.

---

## 10. Keeping Your Branch Up to Date

Before opening a PR, make sure your branch contains the latest changes from `main`.

```bash
git fetch origin
git rebase origin/main
```

If there are conflicts, resolve them locally before submitting the PR.

After resolving conflicts:

```bash
git add .
git rebase --continue
```

Then push your branch:

```bash
git push --force-with-lease
```

Use `--force-with-lease`, not `--force`, when pushing a rebased branch.

---

## 11. Pull Requests

When your work is complete:

```bash
git push -u origin feature/<feature-name>
```

Open a Pull Request from your feature branch into `main`.

### PR title

Use a clear title:

```text
feat: add post creation
fix: prevent duplicate likes
feat: add user profile endpoint
```

### PR description

Include:

```text
## What was changed

- Added post creation endpoint
- Added request validation
- Added authentication requirement

## Testing

- Tested successful post creation
- Tested unauthenticated request
- Tested empty post content

## Related issues

Closes #12
```

---

## 12. PR Checklist

Before requesting a review, make sure:

- [ ] The feature works as expected
- [ ] Tests have been added/updated where appropriate
- [ ] Validation has been implemented
- [ ] Authentication/authorization has been considered
- [ ] Error handling has been implemented
- [ ] API response follows the project's standard format
- [ ] No secrets or `.env` files were committed
- [ ] No unnecessary files were changed
- [ ] Code is formatted
- [ ] Lint passes
- [ ] Tests pass
- [ ] The branch is up to date with `main`

---

## 13. Code Review

Reviewers should focus on:

- Correctness
- Security
- API design
- Database queries
- Error handling
- Validation
- Maintainability
- Tests
- Unnecessary complexity

Reviews should be about improving the code, not criticizing the developer.

If you request a change, explain **why** the change is necessary where it may not be obvious.

---

## 14. Avoiding Merge Conflicts

To minimize conflicts:

1. Keep branches short-lived.
2. Make small, focused PRs.
3. Avoid modifying files unrelated to your feature.
4. Communicate before changing shared files.
5. Regularly update your branch from `main`.
6. Don't rewrite another developer's work.
7. Don't mix unrelated refactoring into feature PRs.

For example, if you're implementing likes, avoid simultaneously restructuring the authentication module in the same PR.

---

## 15. Pulling Changes After a Merge

After your PR has been merged:

```bash
git switch main
git pull origin main
```

Delete your local feature branch:

```bash
git branch -d feature/<feature-name>
```

The remote branch should also be deleted after merging.

When starting your next task, always branch from the latest `main`.

---

## 16. Environment Variables

Never commit secrets.

Do not commit:

```text
.env
.env.local
.env.production
```

Instead, use:

```text
.env.example
```

Example:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
```

The `.env.example` file should contain the required variable names but no real credentials.

---

## 17. Definition of Done

A feature is considered complete when:

```text
┌──────────────────────────────┐
│ Feature implemented          │
├──────────────────────────────┤
│ Validation added             │
│ Error handling added         │
│ Tests added                  │
│ API documented               │
│ Database changes included    │
│ Lint passes                  │
│ Tests pass                   │
│ PR reviewed                  │
│ PR merged                    │
└──────────────────────────────┘
```

Do not consider a feature complete simply because the endpoint works locally.

---

## 18. Team Principle

The goal is not just to avoid Git conflicts.

We want the codebase to remain easy for another developer to understand and modify.

**Keep changes isolated, communicate changes to shared resources, follow the agreed API/database contracts, and keep `main` stable.**
