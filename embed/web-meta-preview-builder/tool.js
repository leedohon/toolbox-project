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
const articleSample=document.createElement('button');articleSample.className='st-secondary';articleSample.id='meta-article-sample';articleSample.type='button';articleSample.dataset.ko='기사 페이지 예제';articleSample.dataset.en='Article page example';articleSample.textContent=window.ToolboxI18n?.language==='en'?'Article page example':'기사 페이지 예제';metaSample.after(articleSample);articleSample.addEventListener('click',()=>{document.querySelector('#title').value='브라우저 도구를 빠르게 활용하는 방법';document.querySelector('#description').value='설치 없이 바로 쓰는 웹 도구의 선택 기준과 실제 활용 순서를 정리했습니다.';document.querySelector('#url').value='https://example.com/guides/browser-tools';document.querySelector('#image').value='https://example.com/images/browser-tools.jpg';document.querySelector('#imageAlt').value='브라우저 도구 활용 안내 화면';document.querySelector('#sg-fallback').hidden=true;document.querySelector('#sg-run').click();});
const productSample=document.createElement('button');productSample.className='st-secondary';productSample.id='meta-product-sample';productSample.type='button';productSample.dataset.ko='상품 페이지 예제';productSample.dataset.en='Product page example';productSample.textContent=window.ToolboxI18n?.language==='en'?'Product page example':'상품 페이지 예제';articleSample.after(productSample);productSample.addEventListener('click',()=>{document.querySelector('#title').value='휴대용 블루투스 스피커';document.querySelector('#description').value='가볍게 휴대하고 하루 종일 사용할 수 있는 생활 방수 블루투스 스피커입니다.';document.querySelector('#url').value='https://example.com/products/portable-speaker';document.querySelector('#image').value='https://example.com/images/portable-speaker.jpg';document.querySelector('#imageAlt').value='휴대용 블루투스 스피커 제품 이미지';document.querySelector('#sg-fallback').hidden=true;document.querySelector('#sg-run').click();});
document.querySelector('#meta-remove-image').addEventListener('click', () => {
  document.querySelector('#image').value = '';
  document.querySelector('#imageAlt').value = '';
  document.querySelector('#sg-run').click();
});
