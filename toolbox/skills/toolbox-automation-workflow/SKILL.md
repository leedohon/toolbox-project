---
name: toolbox-automation-workflow
description: Orchestrate the Blogger Toolbox daily-light, hard, all-in, or create workflow using the repository's machine-readable plans, resumable stages, impact-selected validation, publishing, Git, and deployment. Use for 자동작업처리, 자동 워크플로, 데일리 라이트, 하드, 올인, or 크리에이트 requests.
---

# Toolbox Automation Workflow

Keep this skill as a thin router. Repository files are the policy source.

1. Read root `ai-index.json`, the selected `toolbox/automation/workflows/<id>.json`, and `toolbox/automation/knowledge-optimization.json`. Read `AUTOMATED-WORKFLOW.md` only for policy details not represented in JSON.
2. Report records from `toolbox/automation-results/unchecked/*.json` only; never scan `checked/` during startup. Reuse an explicit workflow choice and ask shutdown once; `아니` means no schedule.
3. Normalize the request into work type, target tools, version level, Blogger publishing, Git/deployment, and shutdown fields.
4. Resume from the first incomplete stage in `select → implement → validate → publish → commit → deploy → confirm`; never repeat a completed stage without evidence that it became stale.
5. Use `toolbox-post-draft` for public tool pages. Select checks from `toolbox/automation/impact-rules.json` and use `toolbox/automation/block-codes.json` for blockers.
6. Write the required result JSON under `toolbox/automation-results/unchecked/` with `confirm: "N"`, then complete publishing, commit, push, and deployment required by the selected plan. On explicit confirmation, run `node scripts/manage-automation-results.mjs confirm <runId>` to update and move it to `checked/`.
7. During a workflow, apply at most one queued Skill/Markdown optimization whose trigger paths overlap the current change and whose cost stays within the central budget. Otherwise only deduplicate and record the candidate. Claim the 50% target only with comparable before/after evidence; never bulk-retrofit unrelated files.
