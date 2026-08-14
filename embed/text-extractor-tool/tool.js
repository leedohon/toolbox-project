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
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
const syncInjectedLabels=()=>document.querySelectorAll('#extract-sample,#extract-url-sample').forEach(button=>{button.textContent=tr(button.dataset.ko,button.dataset.en);});
input.addEventListener('input',updateCount);updateCount();
const extractorSample=document.createElement('button');extractorSample.className='st-secondary';extractorSample.id='extract-sample';extractorSample.type='button';extractorSample.dataset.ko='연락처 예제';extractorSample.dataset.en='Contact example';extractorSample.textContent=window.ToolboxI18n?.language==='en'?'Contact example':'연락처 예제';document.querySelector('.st-actions').prepend(extractorSample);extractorSample.addEventListener('click',()=>{input.value='문의 hello@example.com · https://example.com · #toolbox · @helper · 192.168.10.25';document.querySelector('#mode').value='email';document.querySelector('#mode').dispatchEvent(new Event('change',{bubbles:true}));updateCount();document.querySelector('#sg-run').click();});
const extractorUrlSample=document.createElement('button');extractorUrlSample.className='st-secondary';extractorUrlSample.id='extract-url-sample';extractorUrlSample.type='button';extractorUrlSample.dataset.ko='URL 추출 예제';extractorUrlSample.dataset.en='URL extraction example';extractorUrlSample.textContent=window.ToolboxI18n?.language==='en'?'URL extraction example':'URL 추출 예제';extractorSample.after(extractorUrlSample);extractorUrlSample.addEventListener('click',()=>{input.value='문서 https://example.com/docs 와 API https://api.example.com/v1/items?page=2 를 확인하세요.';document.querySelector('#mode').value='url';document.querySelector('#mode').dispatchEvent(new Event('change',{bubbles:true}));updateCount();document.querySelector('#sg-run').click();});
document.querySelector('#extract-save').addEventListener('click',()=>{const result=document.querySelector('#sg-result'),text=document.querySelector('#sg-output').innerText.trim();if(result.hidden||!text){document.querySelector('#sg-status').textContent=window.ToolboxI18n?.language==='en'?'Extract some information before saving.':'저장할 정보를 먼저 추출해 주세요.';return;}const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));link.download='extracted-information.txt';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);});
document.querySelector('#extract-save-csv').addEventListener('click',()=>{
  const result=document.querySelector('#sg-result'),rows=[...document.querySelectorAll('#sg-output .sg-result-row')],status=document.querySelector('#sg-status');
  if(result.hidden||!rows.length){status.textContent=tr('CSV로 저장할 정보를 먼저 추출해 주세요.','Extract some information before saving CSV.');status.className='st-status is-error';return;}
  const values=rows.at(-1).querySelector('dd').textContent.split('\n').map(value=>value.trim()).filter(Boolean);
  const empty=tr('일치하는 항목 없음','No matching items');
  if(!values.length||values.length===1&&values[0]===empty){status.textContent=tr('CSV로 저장할 일치 항목이 없습니다.','There are no matching items to save as CSV.');status.className='st-status is-error';return;}
  const kind=document.querySelector('#mode').value,escape=value=>`"${String(value).replaceAll('"','""')}"`;
  const csv='\uFEFFtype,value\r\n'+values.map(value=>`${escape(kind)},${escape(value)}`).join('\r\n');
  const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.download=`extracted-${kind}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  status.textContent=tr(`${values.length.toLocaleString()}개 항목을 CSV로 저장했습니다.`,`${values.length.toLocaleString()} items saved as CSV.`);status.className='st-status is-good';
});
addEventListener('toolbox-language-change',syncInjectedLabels);syncInjectedLabels();
