import {copyText,setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $=selector=>document.querySelector(selector);
const tr=(ko,en)=>window.ToolboxI18n?.language==='en'?en:ko;
let copyValue='';

function flags(){return [...document.querySelectorAll('[name="regex-flag"]:checked')].map(input=>input.value).join('');}
function setStatus(ko,en,error=false){const status=$('#regex-status');status.textContent=tr(ko,en);status.className=`st-status ${error?'is-error':'is-good'}`;}
function escapeHtml(value){return value.replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}

function run(){
  const pattern=$('#regex-pattern').value,text=$('#regex-text').value,result=$('#regex-result'),list=$('#regex-list');
  if(!pattern){result.hidden=true;copyValue='';setStatus('정규식 패턴을 입력해 주세요.','Enter a regular expression pattern.',true);return;}
  try{
    const selectedFlags=flags(),scanFlags=selectedFlags.includes('g')?selectedFlags:`${selectedFlags}g`,expression=new RegExp(pattern,scanFlags),matches=[];
    let match;
    while((match=expression.exec(text))&&matches.length<201){matches.push({value:match[0],index:match.index});if(match[0]==='')expression.lastIndex+=1;}
    const limited=matches.length>200,visible=matches.slice(0,200);
    list.replaceChildren(...visible.map((item,index)=>{const row=document.createElement('li');row.textContent=tr(`${index+1}. ${item.index}번 위치: ${item.value||'(빈 문자열)'}`,`${index+1}. Position ${item.index}: ${item.value||'(empty string)'}`);return row;}));
    let cursor=0,highlight='';
    for(const item of visible){highlight+=escapeHtml(text.slice(cursor,item.index));highlight+=`<mark>${escapeHtml(item.value)||'&#8203;'}</mark>`;cursor=item.index+item.value.length;}
    highlight+=escapeHtml(text.slice(cursor));
    $('#regex-highlight').innerHTML=highlight.replaceAll('\n','<br>');
    $('#regex-summary').textContent=tr(`${visible.length}개가 일치했습니다${limited?' (최대 200개 표시)':''}.`,`${visible.length} matches found${limited?' (showing up to 200)':''}.`);
    copyValue=visible.map((item,index)=>`${index+1}\t${item.index}\t${item.value}`).join('\n');
    result.hidden=false;
    setStatus(visible.length?'일치 항목을 찾았습니다.':'일치하는 항목이 없습니다.',visible.length?'Matches found.':'No matches found.');
  }catch(error){result.hidden=true;copyValue='';setStatus(`패턴을 확인해 주세요: ${error.message}`,`Check the pattern: ${error.message}`,true);}
}

$('#regex-run').addEventListener('click',run);
$('#regex-pattern').addEventListener('input',run);
$('#regex-text').addEventListener('input',run);
document.querySelectorAll('[name="regex-flag"]').forEach(input=>input.addEventListener('change',run));
$('#regex-copy').addEventListener('click',async()=>{if(!copyValue){setStatus('복사할 일치 결과가 없습니다.','There are no match results to copy.',true);return;}if(await copyText(copyValue)){setStatus('일치 결과를 복사했습니다.','Match results copied.');$('#regex-fallback').hidden=true;}else{$('#regex-fallback').value=copyValue;$('#regex-fallback').hidden=false;setStatus('자동 복사가 차단되어 직접 복사할 결과를 표시했습니다.','Automatic copying was blocked. A manual copy field is shown.',true);}});
$('#regex-reset').addEventListener('click',()=>{$('#regex-pattern').value='[가-힣]+';$('#regex-text').value='Hello 정규식 tester\n두 번째 한글 문장';document.querySelectorAll('[name="regex-flag"]').forEach(input=>{input.checked=input.value==='g';});$('#regex-fallback').hidden=true;run();setStatus('기본 예제로 초기화했습니다.','Reset to the default example.');});
addEventListener('toolbox-language-change',run);
run();
setupEmbedHeight('regex-tester',{content:true});
