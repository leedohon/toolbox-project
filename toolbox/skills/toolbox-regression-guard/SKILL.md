---
name: toolbox-regression-guard
description: Prevent repeat Blogger Toolbox UI and runtime defects by matching changed files or bug reports to the compact known-issue registry and running only the relevant regression checks. Use for bug fixes, UI QA, iframe sizing, responsive regressions, hidden-state problems, or requests to track and prevent similar issues.
---

# Toolbox Regression Guard

Keep this skill thin to avoid loading unnecessary Markdown.

1. Read `toolbox/quality/ai-index.json`, then match changed paths and request terms against `toolbox/quality/known-issues.json`.
2. Load and apply only matched issue entries. Add their `regressionChecks` to the current validation plan and record the issue codes as evidence.
3. When a new concrete defect is fixed, add one compact registry entry with code, symptom, root cause, fix contract, repeatable checks, and affected patterns.
4. Do not create a new skill or guide for each issue. Keep issue details in the JSON registry and keep this skill as the single router.
5. Periodically merge duplicate fingerprints and archive obsolete entries when registry size begins to slow matching.
