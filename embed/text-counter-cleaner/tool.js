import {copyText,setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $=selector=>document.querySelector(selector);
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
const size=value=>value<1024?`${value} B`:value<1048576?`${(value/1024).toFixed(1)} KB`:`${(value/1048576).toFixed(2)} MB`;

function count(){
  const text=$('#text-input').value;
  const tokens=text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  const words=(text.trim().match(/\S+/gu)||[]).length;
  const paragraphs=text.trim()?text.trim().split(/\n\s*\n/).filter(Boolean).length:0;
  $('#count-all').textContent=[...text].length.toLocaleString();
  $('#count-no-space').textContent=[...text.replace(/\s/gu,'')].length.toLocaleString();
  $('#count-words').textContent=words.toLocaleString();
  $('#count-lines').textContent=text?text.split(/\r?\n/).length.toLocaleString():'0';
  $('#count-sentences').textContent=(text.match(/[^.!?。！？\n]+[.!?。！？]?/gu)||[]).filter(value=>value.trim()).length.toLocaleString();
  $('#count-paragraphs').textContent=paragraphs.toLocaleString();
  $('#count-reading').textContent=words?tr(`${Math.max(1,Math.ceil(words/250)).toLocaleString()}분`,`${Math.max(1,Math.ceil(words/250)).toLocaleString()} min`):tr('0분','0 min');
  $('#count-bytes').textContent=size(new TextEncoder().encode(text).length);
  const frequencies=new Map();
  tokens.forEach(token=>frequencies.set(token,(frequencies.get(token)||0)+1));
  const top=[...frequencies].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,5);
  $('#text-frequency-value').textContent=top.length?top.map(([word,frequency])=>`${word} × ${frequency}`).join(' · '):tr('입력하면 상위 5개를 표시합니다.','Enter text to see the top five words.');
}

function status(message,error=false){
  $('#text-status').textContent=message;
  $('#text-status').className=`st-status ${error?'is-error':'is-good'}`;
}

function clean(){
  let text=$('#text-input').value;
  if(!text)return status(tr('정리할 텍스트를 입력해 주세요.','Enter text to clean.'),true);
  text=text.replace(/\r\n?/g,'\n');
  if($('#clean-trim').checked)text=text.split('\n').map(line=>line.trim()).join('\n');
  if($('#clean-spaces').checked)text=text.replace(/[\t ]{2,}/g,' ');
  if($('#clean-lines').checked)text=text.replace(/\n{3,}/g,'\n\n');
  if($('#clean-breaks').checked)text=text.replace(/\s*\n+\s*/g,' ');
  $('#text-output').value=text;
  status(tr('텍스트를 정리했습니다. 원본은 그대로 유지됩니다.','Text cleaned. The original remains unchanged.'));
}

$('#text-input').addEventListener('input',()=>{
  $('#text-output').value='';
  $('#text-fallback').hidden=true;
  $('#text-status').className='st-status';
  $('#text-status').textContent=tr('입력이 바뀌었습니다. 정리 버튼을 눌러 주세요.','Input changed. Choose Clean to refresh the result.');
  count();
});
$('#text-clean').addEventListener('click',clean);
$('#text-copy').addEventListener('click',async()=>{
  const value=$('#text-output').value;
  if(!value)return status(tr('먼저 텍스트를 정리해 주세요.','Clean the text first.'),true);
  if(await copyText(value)){$('#text-fallback').hidden=true;status(tr('정리 결과를 복사했습니다.','Copied the cleaned text.'));}
  else{$('#text-fallback').value=value;$('#text-fallback').hidden=false;status(tr('자동 복사가 차단되었습니다. 아래 결과를 직접 선택해 복사해 주세요.','Automatic copying was blocked. Select the result below and copy it manually.'));}
});
$('#text-reset').addEventListener('click',()=>{
  $('#text-input').value='';$('#text-output').value='';$('#text-fallback').hidden=true;count();status(tr('입력과 결과를 비웠습니다.','Cleared the input and result.'));
});
addEventListener('toolbox-language-change',count);
count();
setupEmbedHeight('text-counter-cleaner',{content:true});
