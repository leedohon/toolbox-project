import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.2';
import {copyText} from '../../assets/play-tools.js?v=0.3.2';
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
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
const syncInjectedLabels=()=>document.querySelectorAll('#meta-sample,#meta-article-sample,#meta-product-sample').forEach(button=>{button.textContent=tr(button.dataset.ko,button.dataset.en);});
document.querySelector('#meta-copy-social').addEventListener('click',async()=>{
  const result=document.querySelector('#sg-result'),status=document.querySelector('#sg-status'),fallback=document.querySelector('#sg-fallback');
  const row=[...document.querySelectorAll('#sg-output .sg-result-row')].find(item=>item.querySelector('dt')?.textContent.includes(window.ToolboxI18n?.language==='en'?'Open Graph':'Open Graph'));
  const value=row?.querySelector('dd')?.textContent.trim();
  if(result.hidden||!value){status.textContent=tr('먼저 메타 미리보기를 만들어 주세요.','Build a meta preview first.');status.className='st-status is-error';return;}
  if(await copyText(value)){fallback.hidden=true;status.textContent=tr('Open Graph와 Twitter/X 태그를 복사했습니다.','Open Graph and Twitter/X tags copied.');status.className='st-status is-good';}
  else{fallback.value=value;fallback.hidden=false;status.textContent=tr('직접 복사할 소셜 태그를 표시했습니다.','Social tags are shown for manual copying.');status.className='st-status is-error';}
});
addEventListener('toolbox-language-change',syncInjectedLabels);syncInjectedLabels();
