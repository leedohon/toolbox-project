import {copyText,setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $=selector=>document.querySelector(selector);
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
let copyValue='',replacementValue='';
const splitButton=document.createElement('button');splitButton.className='st-secondary';splitButton.id='regex-split';splitButton.type='button';splitButton.dataset.ko='패턴으로 나누기';splitButton.dataset.en='Split by pattern';splitButton.textContent=tr('패턴으로 나누기','Split by pattern');$('#regex-run').after(splitButton);const splitResult=document.createElement('section');splitResult.className='st-result';splitResult.id='regex-split-result';splitResult.hidden=true;splitResult.innerHTML='<h2 data-ko="나누기 결과" data-en="Split result">나누기 결과</h2><textarea class="wf-output-text wf-long-output" id="regex-split-output" readonly spellcheck="false" tabindex="0" role="region" data-ko-aria-label="정규식 나누기 결과" data-en-aria-label="Regular expression split result"></textarea>';$('#regex-result').after(splitResult);

function flags(){return [...document.querySelectorAll('[name="regex-flag"]:checked')].map(input=>input.value).join('');}
function setStatus(ko,en,error=false){const status=$('#regex-status');status.textContent=tr(ko,en);status.className=`st-status ${error?'is-error':'is-good'}`;}
function escapeHtml(value){return value.replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}

function run(){
  const pattern=$('#regex-pattern').value,text=$('#regex-text').value,result=$('#regex-result'),list=$('#regex-list');
  $('#regex-fallback').hidden=true;
  if(!pattern){result.hidden=true;copyValue='';setStatus('정규식 패턴을 입력해 주세요.','Enter a regular expression pattern.',true);return;}
  try{
    const selectedFlags=flags(),expression=new RegExp(pattern,selectedFlags),matches=[];
    let match;
    while((match=expression.exec(text))&&matches.length<201){matches.push({value:match[0],index:match.index,groups:match.slice(1),named:match.groups||{}});if(!selectedFlags.includes('g'))break;if(match[0]==='')expression.lastIndex+=1;}
    const limited=matches.length>200,visible=matches.slice(0,200);
    list.replaceChildren(...visible.map((item,index)=>{const row=document.createElement('li');const numbered=item.groups.map((value,groupIndex)=>`#${groupIndex+1}=${value??tr('(없음)','(unset)')}`),named=Object.entries(item.named).map(([name,value])=>`${name}=${value??tr('(없음)','(unset)')}`),captures=[...numbered,...named];row.textContent=tr(`${index+1}. ${item.index}번 위치: ${item.value||'(빈 문자열)'}`,`${index+1}. Position ${item.index}: ${item.value||'(empty string)'}`)+(captures.length?tr(` · 캡처 ${captures.join(', ')}`,` · Captures ${captures.join(', ')}`):'');return row;}));
    let cursor=0,highlight='';
    for(const item of visible){highlight+=escapeHtml(text.slice(cursor,item.index));highlight+=`<mark>${escapeHtml(item.value)||'&#8203;'}</mark>`;cursor=item.index+item.value.length;}
    highlight+=escapeHtml(text.slice(cursor));
    $('#regex-highlight').innerHTML=highlight.replaceAll('\n','<br>');
    $('#regex-summary').textContent=tr(`${visible.length}개가 일치했습니다${limited?' (최대 200개 표시)':''}.`,`${visible.length} matches found${limited?' (showing up to 200)':''}.`);
    copyValue=visible.map((item,index)=>`${index+1}\t${item.index}\t${item.value}`).join('\n');
    const replaceEnabled=$('#regex-replace-enabled').checked;
    replacementValue=replaceEnabled?text.replace(new RegExp(pattern,selectedFlags),$('#regex-replacement').value):'';
    $('#regex-replacement-output').value=replacementValue;
    $('#regex-replacement-result').hidden=!replaceEnabled;
    result.hidden=false;
    setStatus(visible.length?'일치 항목을 찾았습니다.':'일치하는 항목이 없습니다.',visible.length?'Matches found.':'No matches found.');
  }catch(error){result.hidden=true;copyValue='';replacementValue='';setStatus(`패턴을 확인해 주세요: ${error.message}`,`Check the pattern: ${error.message}`,true);}
}

$('#regex-run').addEventListener('click',run);
splitButton.addEventListener('click',()=>{const pattern=$('#regex-pattern').value;if(!pattern)return setStatus('정규식 패턴을 입력해 주세요.','Enter a regular expression pattern.',true);try{const parts=$('#regex-text').value.split(new RegExp(pattern,flags().replace('g','')));$('#regex-split-output').value=parts.map((part,index)=>`${index+1}. ${part}`).join('\n');splitResult.hidden=false;setStatus(`${parts.length}개 부분으로 나눴습니다.`,`Split into ${parts.length} parts.`);}catch(error){splitResult.hidden=true;setStatus(`패턴을 확인해 주세요: ${error.message}`,`Check the pattern: ${error.message}`,true);}});
document.querySelectorAll('.regex-preset').forEach(button=>button.addEventListener('click',()=>{$('#regex-pattern').value=button.dataset.pattern;$('#regex-text').value=button.dataset.text;$('#regex-fallback').hidden=true;run();}));
const phonePreset=document.createElement('button');phonePreset.className='st-secondary regex-preset';phonePreset.id='regex-phone-preset';phonePreset.type='button';phonePreset.dataset.ko='전화번호 예제';phonePreset.dataset.en='Phone example';phonePreset.textContent=tr('전화번호 예제','Phone example');document.querySelector('.st-actions[aria-label]').append(phonePreset);phonePreset.addEventListener('click',()=>{$('#regex-pattern').value='01[016789]-?\\d{3,4}-?\\d{4}';$('#regex-text').value='문의 010-1234-5678, 예비 011-234-5678';$('#regex-fallback').hidden=true;run();});
$('#regex-pattern').addEventListener('input',run);
$('#regex-text').addEventListener('input',run);
document.querySelectorAll('[name="regex-flag"]').forEach(input=>input.addEventListener('change',run));
$('#regex-replace-enabled').addEventListener('change',()=>{$('#regex-replacement-field').hidden=!$('#regex-replace-enabled').checked;run();});
$('#regex-replacement').addEventListener('input',run);
$('#regex-copy').addEventListener('click',async()=>{if(!copyValue){setStatus('복사할 일치 결과가 없습니다.','There are no match results to copy.',true);return;}if(await copyText(copyValue)){setStatus('일치 결과를 복사했습니다.','Match results copied.');$('#regex-fallback').hidden=true;}else{$('#regex-fallback').value=copyValue;$('#regex-fallback').hidden=false;setStatus('자동 복사가 차단되어 직접 복사할 결과를 표시했습니다.','Automatic copying was blocked. A manual copy field is shown.',true);}});
$('#regex-copy-replacement').addEventListener('click',async()=>{if(await copyText(replacementValue)){setStatus('치환 결과를 복사했습니다.','Replacement result copied.');$('#regex-fallback').hidden=true;}else{$('#regex-fallback').value=replacementValue;$('#regex-fallback').hidden=false;setStatus('직접 복사할 치환 결과를 표시했습니다.','A manual replacement copy field is shown.',true);}});
$('#regex-reset').addEventListener('click',()=>{$('#regex-pattern').value='[가-힣]+';$('#regex-text').value='Hello 정규식 tester\n두 번째 한글 문장';$('#regex-replace-enabled').checked=false;$('#regex-replacement').value='';$('#regex-replacement-field').hidden=true;document.querySelectorAll('[name="regex-flag"]').forEach(input=>{input.checked=input.value==='g';});$('#regex-fallback').hidden=true;run();setStatus('기본 예제로 초기화했습니다.','Reset to the default example.');});
addEventListener('toolbox-language-change',run);
run();
setupEmbedHeight('regex-tester',{content:true});
