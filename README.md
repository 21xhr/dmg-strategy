# dmg-strategy

Private planning workspace for DMG project.

This repository contains:
- Strategy planning and roadmap documents
- Fundraising materials
- External network and relationship management
- Exploratory analysis and research

**Shareable product and engineering documentation lives in:**
`/Users/mac/dmg-workspace/apps/docs`

## Repository customization

This repository includes a custom documentation guard in `scripts/check-doc-chat-phrasing.sh`.

The guard runs from `.githooks/pre-commit` and blocks staged Markdown that reads like chat-answer phrasing rather than durable documentation.

Use `DOC_CHAT_OK=1` only when you intentionally need to bypass that rule for a specific commit.
