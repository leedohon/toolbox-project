import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.2.2';
mountGeneratedTool({
  "slug": "text-extractor-tool",
  "preset": "text-extractor-tool",
  "fields": [
    "mode",
    "text"
  ]
});
const extractorSample=document.createElement('button');extractorSample.className='st-secondary';extractorSample.id='extract-sample';extractorSample.type='button';extractorSample.dataset.ko='연락처 예제';extractorSample.dataset.en='Contact example';extractorSample.textContent=window.ToolboxI18n?.language==='en'?'Contact example':'연락처 예제';document.querySelector('.st-actions').prepend(extractorSample);extractorSample.addEventListener('click',()=>{document.querySelector('#text').value='문의 hello@example.com · https://example.com · #toolbox · @helper';document.querySelector('#mode').value='email';document.querySelector('#mode').dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('#sg-run').click();});
document.querySelector('#extract-save').addEventListener('click',()=>{const result=document.querySelector('#sg-result'),text=document.querySelector('#sg-output').innerText.trim();if(result.hidden||!text){document.querySelector('#sg-status').textContent=window.ToolboxI18n?.language==='en'?'Extract some information before saving.':'저장할 정보를 먼저 추출해 주세요.';return;}const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));link.download='extracted-information.txt';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);});
