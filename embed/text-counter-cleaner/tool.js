import {copyText,setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $=selector=>document.querySelector(selector);
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
const size=value=>value<1024?`${value} B`:value<1048576?`${(value/1024).toFixed(1)} KB`:`${(value/1048576).toFixed(2)} MB`;
let frequencyText='',frequencyRows=[];const frequencyCopy=document.createElement('button');frequencyCopy.className='st-secondary';frequencyCopy.id='text-frequency-copy';frequencyCopy.type='button';frequencyCopy.dataset.ko='빈도 결과 복사';frequencyCopy.dataset.en='Copy word frequencies';frequencyCopy.textContent=tr('빈도 결과 복사','Copy word frequencies');$('#text-frequency').append(frequencyCopy);frequencyCopy.addEventListener('click',async()=>{if(!frequencyText)return status(tr('복사할 단어 빈도가 없습니다.','There are no word frequencies to copy.'),true);if(await copyText(frequencyText))status(tr('단어 빈도를 복사했습니다.','Word frequencies copied.'));else{$('#text-fallback').value=frequencyText;$('#text-fallback').hidden=false;status(tr('직접 복사할 단어 빈도를 표시했습니다.','Word frequencies are shown for manual copying.'));}});
const useResult=document.createElement('button');useResult.className='st-secondary';useResult.id='text-use-result';useResult.type='button';useResult.dataset.ko='결과를 입력으로 옮기기';useResult.dataset.en='Move result to input';useResult.textContent=tr('결과를 입력으로 옮기기','Move result to input');$('#text-save').after(useResult);useResult.addEventListener('click',()=>{const value=$('#text-output').value;if(!value)return status(tr('먼저 텍스트를 정리해 주세요.','Clean the text first.'),true);$('#text-input').value=value;$('#text-output').value='';$('#text-fallback').hidden=true;count();status(tr('정리 결과를 입력으로 옮겼습니다.','Moved the cleaned result to the input.'));});

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
  $('#text-capacity').textContent=`${[...text].length.toLocaleString()} / 100,000`;
  const frequencies=new Map();
  tokens.forEach(token=>frequencies.set(token,(frequencies.get(token)||0)+1));
  const top=[...frequencies].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,5);
  frequencyRows=top;frequencyText=top.map(([word,frequency])=>`${word}\t${frequency}`).join('\n');$('#text-frequency-value').textContent=top.length?top.map(([word,frequency])=>`${word} × ${frequency}`).join(' · '):tr('입력하면 상위 5개를 표시합니다.','Enter text to see the top five words.');
}

function status(message,error=false){
  $('#text-status').textContent=message;
  $('#text-status').className=`st-status ${error?'is-error':'is-good'}`;
}

function clean(){
  let text=$('#text-input').value;
  if(!text)return status(tr('정리할 텍스트를 입력해 주세요.','Enter text to clean.'),true);
  const before=[...text].length;
  text=text.replace(/\r\n?/g,'\n');
  if($('#clean-trim').checked)text=text.split('\n').map(line=>line.trim()).join('\n');
  if($('#clean-spaces').checked)text=text.replace(/[\t ]{2,}/g,' ');
  if($('#clean-lines').checked)text=text.replace(/\n{3,}/g,'\n\n');
  if($('#clean-breaks').checked)text=text.replace(/\s*\n+\s*/g,' ');
  $('#text-output').value=text;
  const after=[...text].length,removed=before-after;
  status(tr(`텍스트를 정리했습니다. ${before.toLocaleString()}자 → ${after.toLocaleString()}자 (${removed>=0?`${removed.toLocaleString()}자 감소`:`${Math.abs(removed).toLocaleString()}자 증가`})`,`Text cleaned. ${before.toLocaleString()} → ${after.toLocaleString()} characters (${removed>=0?`${removed.toLocaleString()} removed`:`${Math.abs(removed).toLocaleString()} added`}).`));
}

$('#text-input').addEventListener('input',()=>{
  $('#text-output').value='';
  $('#text-fallback').hidden=true;
  $('#text-status').className='st-status';
  $('#text-status').textContent=tr('입력이 바뀌었습니다. 정리 버튼을 눌러 주세요.','Input changed. Choose Clean to refresh the result.');
  count();
});
$('#text-clean').addEventListener('click',clean);
const spacingSample=document.createElement('button');spacingSample.className='st-secondary';spacingSample.id='text-space-sample';spacingSample.type='button';spacingSample.dataset.ko='공백 정리 예제';spacingSample.dataset.en='Spacing cleanup example';spacingSample.textContent=tr('공백 정리 예제','Spacing cleanup example');$('#text-clean').before(spacingSample);spacingSample.addEventListener('click',()=>{$('#text-input').value=tr('  회의   자료를   확인해 주세요.\n\n\n다음  일정은  금요일입니다.  ','  Review   the meeting   notes.\n\n\nThe next  meeting is Friday.  ');$('#clean-trim').checked=true;$('#clean-spaces').checked=true;$('#clean-lines').checked=true;$('#clean-breaks').checked=false;$('#text-fallback').hidden=true;count();clean();});
const paragraphSample=document.createElement('button');paragraphSample.className='st-secondary';paragraphSample.id='text-paragraph-sample';paragraphSample.type='button';paragraphSample.dataset.ko='문단 정리 예제';paragraphSample.dataset.en='Paragraph cleanup example';paragraphSample.textContent=tr('문단 정리 예제','Paragraph cleanup example');spacingSample.after(paragraphSample);paragraphSample.addEventListener('click',()=>{$('#text-input').value=tr('첫 문단입니다.\n줄바꿈이 너무 잦습니다.\n\n\n둘째 문단입니다.\n문장을 이어서 읽습니다.','This is the first paragraph.\nLine breaks are too frequent.\n\n\nThis is the second paragraph.\nContinue reading the sentence.');$('#clean-trim').checked=true;$('#clean-spaces').checked=false;$('#clean-lines').checked=false;$('#clean-breaks').checked=true;$('#text-fallback').hidden=true;count();clean();});
$('#text-copy').addEventListener('click',async()=>{
  const value=$('#text-output').value;
  if(!value)return status(tr('먼저 텍스트를 정리해 주세요.','Clean the text first.'),true);
  if(await copyText(value)){$('#text-fallback').hidden=true;status(tr('정리 결과를 복사했습니다.','Copied the cleaned text.'));}
  else{$('#text-fallback').value=value;$('#text-fallback').hidden=false;status(tr('자동 복사가 차단되었습니다. 아래 결과를 직접 선택해 복사해 주세요.','Automatic copying was blocked. Select the result below and copy it manually.'));}
});
$('#text-save').addEventListener('click',()=>{
  const value=$('#text-output').value;
  if(!value)return status(tr('먼저 텍스트를 정리해 주세요.','Clean the text first.'),true);
  const url=URL.createObjectURL(new Blob([`${value}\n`],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='toolbox-cleaned-text.txt';link.click();URL.revokeObjectURL(url);
  $('#text-fallback').hidden=true;status(tr('정리 결과를 TXT로 저장했습니다.','Saved the cleaned text as a TXT file.'));
});
$('#text-frequency-save').addEventListener('click',()=>{if(!frequencyRows.length)return status(tr('저장할 단어 빈도가 없습니다.','There are no word frequencies to save.'),true);const escape=value=>`"${String(value).replaceAll('"','""')}"`,csv=`${tr('단어,빈도','word,frequency')}\n${frequencyRows.map(([word,frequency])=>`${escape(word)},${frequency}`).join('\n')}\n`,url=URL.createObjectURL(new Blob([`\ufeff${csv}`],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='toolbox-word-frequencies.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),0);status(tr('단어 빈도를 CSV로 저장했습니다.','Saved word frequencies as CSV.'));});
$('#text-reset').addEventListener('click',()=>{
  $('#text-input').value='';$('#text-output').value='';$('#text-fallback').hidden=true;count();status(tr('입력과 결과를 비웠습니다.','Cleared the input and result.'));
});
addEventListener('toolbox-language-change',count);
count();
setupEmbedHeight('text-counter-cleaner',{content:true});
