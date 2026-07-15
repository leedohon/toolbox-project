---
name: toolbox-post-draft
description: Draft, revise, version, validate, publish, and release Blogger Toolbox tool posts with shared content, discovery keywords, hashtags, FAQ, patch notes, responsive UI, and token-efficient automation. Use for any new Toolbox post, tool release, post copy change, FAQ/detail update, search/discovery change, or global Blogger tool-post theme change.
---

# Toolbox post draft

1. Locate the repository root containing `toolbox/AGENTS.md` and `outputs/tools.json`.
2. Read `AGENTS.md`, `toolbox/AGENTS.md`, and `toolbox/guides/post-drafting-guide.md`. For a new module or merge/split task, also read `toolbox/guides/tool-module-compatibility.md`. Do not load old release HTML unless debugging a regression.
3. Record the request in `toolbox/requests/*.md`; update the relevant `toolbox/tools/*.md` only for functional or interface rules.
4. Implement tool behavior behind one stable `embed/<tool>/index.html` public entry. For newly created or newly merged tools, separate replaceable feature modules from the post shell; do not retrofit every old tool. Merge related flows behind a clear mode choice, preserve retired URLs, indexes, versions, and result-code engines, and record `status: retired` plus `replacementTool` instead of deleting them. Reuse shared CSS, language modules, helpers, and safe mobile focus behavior.
5. Edit user-facing detail paragraphs and at least four FAQs in `toolbox/post-content.json`. Exclude deployment and post-maintenance questions.
6. Maintain visible hashtags, Blogger labels, and 20–30 Korean/English discovery terms per tool in `toolbox/post-tags.json`. Use `[초간단 툴박스] 도구명` by default or the manifest `category` when the user defines another category. Reuse the shared Openworld Blog intro and JSON catalog search on home and every non-home screen. Keep the home's three-column tool cards visible for an empty query; only non-home screens hide empty results and show lightweight matching links after input.
7. Create a release with `scripts/create-tool-release.mjs`; never edit an old release folder.
8. Run `scripts/build-tool-posts.mjs <tool>`, `scripts/build-tool-catalog.mjs`, `scripts/validate-tool-releases.mjs`, and `scripts/validate-tool-modules.mjs` when a module registry exists. Do not hand-write shared post HTML.
9. Run `scripts/serve-local.mjs` and preview `toolbox/preview-post.html?tool=<tool>&contentOnly=1`. Verify the tool, post, label search, search results, archive, preserved Blogger result list, and attribution-only compact footer at mobile and desktop sizes, including input, error, long content, overflow, iframe height, hashtags, empty and matching search states, fuzzy keyword results, FAQ, cumulative patch notes, floating return-to-search button, and absence of mobile auto-focus. When `assets/blogger/theme.css` changes, bump `themeRelease` in `assets/blogger/site.js` before public QA so Blogger cannot reuse stale CSS. Record QA in the new `patch-notes.json`.
10. Follow `toolbox/BLOGGER-OPERATIONS.md` for Blogger labels/state, Git commit, push, Actions, and public deployment checks.

Keep responses and edits compact: inspect the latest manifest entry, update central sources, and let scripts expand repeated markup.
