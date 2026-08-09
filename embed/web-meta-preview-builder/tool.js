import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.2';
mountGeneratedTool({
  "slug": "web-meta-preview-builder",
  "preset": "web-meta-preview-builder",
  "fields": [
    "title",
    "description",
    "url",
    "image",
    "imageAlt",
    "robots"
  ]
});
document.querySelector('#meta-remove-image').addEventListener('click', () => {
  document.querySelector('#image').value = '';
  document.querySelector('#imageAlt').value = '';
  document.querySelector('#sg-run').click();
});
