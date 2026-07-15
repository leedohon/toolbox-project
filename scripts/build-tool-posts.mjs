import { buildToolPostContent } from './build-tool-post-content.mjs';
import { buildPostPatchNotes } from './build-post-patch-notes.mjs';

const tools = process.argv.slice(2);
const content = await buildToolPostContent(tools);
const patches = await buildPostPatchNotes(tools);
if (content.length !== patches.length) throw new Error('Post content and patch-note build counts do not match.');
console.log(`Built consistent post content for ${content.length} tools.`);
