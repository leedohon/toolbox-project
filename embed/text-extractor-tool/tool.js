import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.3';
mountGeneratedTool({
  "slug": "text-extractor-tool",
  "preset": "text-extractor-tool",
  "fields": [
    "mode",
    "text"
  ]
});
const input=document.querySelector('#text'),counter=document.querySelector('#extract-input-count');
function updateCount(){counter.textContent=`${[...input.value].length.toLocaleString()} / 100,000`;}
input.addEventListener('input',updateCount);updateCount();
const extractorSample=document.createElement('button');extractorSample.className='st-secondary';extractorSample.id='extract-sample';extractorSample.type='button';extractorSample.dataset.ko='연락처 예제';extractorSample.dataset.en='Contact example';extractorSample.textContent=window.ToolboxI18n?.language==='en'?'Contact example':'연락처 예제';document.querySelector('.st-actions').prepend(extractorSample);extractorSample.addEventListener('click',()=>{input.value='문의 hello@example.com · https://example.com · #toolbox · @helper · 192.168.10.25';document.querySelector('#mode').value='email';document.querySelector('#mode').dispatchEvent(new Event('change',{bubbles:true}));updateCount();document.querySelector('#sg-run').click();});
const extractorUrlSample=document.createElement('button');extractorUrlSample.className='st-secondary';extractorUrlSample.id='extract-url-sample';extractorUrlSample.type='button';extractorUrlSample.dataset.ko='URL 추출 예제';extractorUrlSample.dataset.en='URL extraction example';extractorUrlSample.textContent=window.ToolboxI18n?.language==='en'?'URL extraction example':'URL 추출 예제';extractorSample.after(extractorUrlSample);extractorUrlSample.addEventListener('click',()=>{input.value='문서 https://example.com/docs 와 API https://api.example.com/v1/items?page=2 를 확인하세요.';document.querySelector('#mode').value='url';document.querySelector('#mode').dispatchEvent(new Event('change',{bubbles:true}));updateCount();document.querySelector('#sg-run').click();});
document.querySelector('#extract-save').addEventListener('click',()=>{const result=document.querySelector('#sg-result'),text=document.querySelector('#sg-output').innerText.trim();if(result.hidden||!text){document.querySelector('#sg-status').textContent=window.ToolboxI18n?.language==='en'?'Extract some information before saving.':'저장할 정보를 먼저 추출해 주세요.';return;}const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));link.download='extracted-information.txt';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);});
