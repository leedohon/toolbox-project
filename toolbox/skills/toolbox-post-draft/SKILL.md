---
name: toolbox-post-draft
description: Draft, revise, version, validate, publish, and release Blogger Toolbox tool posts with shared content, discovery keywords, hashtags, FAQ, patch notes, responsive UI, and token-efficient automation. Use for any new Toolbox post, tool release, post copy change, FAQ/detail update, search/discovery change, or global Blogger tool-post theme change.
---

# Toolbox post draft

1. Locate the repository root containing `toolbox/AGENTS.md` and `outputs/tools.json`.
2. Read `AGENTS.md`, `toolbox/AGENTS.md`, and `toolbox/guides/post-drafting-guide.md`. Do not load old release HTML unless debugging a regression.
3. Record the request in `toolbox/requests/*.md`; update the relevant `toolbox/tools/*.md` only for functional or interface rules.
4. Implement tool-specific behavior only in `embed/<tool>/index.html`. Merge converters with the same input, output, and user flow behind a format choice instead of creating duplicate tools. Reuse `assets/simple-tools.css`, shared language modules, and existing common helpers before adding tool CSS. Run `scripts/ensure-embed-common-assets.mjs` and use `ToolboxUX.focus` instead of direct focus calls so mobile keyboards never open automatically.
5. Edit user-facing detail paragraphs and at least four FAQs in `toolbox/post-content.json`. Exclude deployment and post-maintenance questions.
6. Maintain visible hashtags, Blogger labels, and 20–30 Korean/English discovery terms per tool in `toolbox/post-tags.json`. Keep `[초간단 툴박스] 도구명` titles. Reuse the shared Openworld Blog intro and JSON catalog search on home and posts; hide results for an empty query and show lightweight matching links only after input.
7. Create a release with `scripts/create-tool-release.mjs`; never edit an old release folder.
8. Run `scripts/build-tool-posts.mjs <tool>`, `scripts/build-tool-catalog.mjs`, and `scripts/validate-tool-releases.mjs`. Do not hand-write shared post HTML.
9. Run `scripts/serve-local.mjs` and preview `toolbox/preview-post.html?tool=<tool>&contentOnly=1`. Verify the tool and post at mobile and desktop sizes, including input, error, long content, overflow, iframe height, hashtags, empty and matching search states, fuzzy keyword results, FAQ, cumulative patch notes, floating return-to-search button, and absence of mobile auto-focus. Record QA in the new `patch-notes.json`.
10. Follow `toolbox/BLOGGER-OPERATIONS.md` for Blogger labels/state, Git commit, push, Actions, and public deployment checks.

Keep responses and edits compact: inspect the latest manifest entry, update central sources, and let scripts expand repeated markup.
