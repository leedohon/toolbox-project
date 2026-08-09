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
const metaSample=document.createElement('button');metaSample.className='st-secondary';metaSample.id='meta-sample';metaSample.type='button';metaSample.dataset.ko='도구 페이지 예제';metaSample.dataset.en='Tool page example';metaSample.textContent=window.ToolboxI18n?.language==='en'?'Tool page example':'도구 페이지 예제';document.querySelector('.st-actions').prepend(metaSample);metaSample.addEventListener('click',()=>{document.querySelector('#title').value='간편한 온라인 도구 모음';document.querySelector('#description').value='설치 없이 브라우저에서 바로 쓰는 가벼운 변환·계산 도구를 확인하세요.';document.querySelector('#url').value='https://example.com/toolbox';document.querySelector('#image').value='';document.querySelector('#imageAlt').value='';document.querySelector('#sg-run').click();});
document.querySelector('#meta-remove-image').addEventListener('click', () => {
  document.querySelector('#image').value = '';
  document.querySelector('#imageAlt').value = '';
  document.querySelector('#sg-run').click();
});
