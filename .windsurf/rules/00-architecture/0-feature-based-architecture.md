---
trigger: model_decision
description: APPLY feature based architecture WHEN organizing code in frontend
globs: apps/frontend/**
---

- Organize code by business feature
- Place all feature code in its own folder
- Co-locate components, hooks, and state per feature
- Use shared folders for common code
- Store features in `features/` directory
- Use global state only for app-wide concerns
- Place components/, pages/, composables/, features/, etc. inside app/.
